  const express = require('express');
  const mysql = require('mysql2/promise');
  const cors = require('cors');

  const webtoken = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  const bodyparser = require('body-parser');
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs"); 

  require("dotenv").config();
  const app = express();

  //MIDDLEWARE
  app.use(express.json());
  app.use(cors());
  app.use(bodyparser.json());
  app.use(express.urlencoded({ extended: true }));

  const uploadPath = path.join(__dirname, "uploads");
  app.use("/uploads", express.static(uploadPath));

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Multer setup
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
      cb(null, randomName);
    },
  });

  const upload = multer({ storage });

  //MYSQL CONNECTION FOR ADMISSION
  const db = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'admission',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
  });

  //MYSQL CONNECTION FOR ROOM MANAGEMENT AND OTHERS
  const db3 = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'enrollment',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
  });

/*---------------------------------START---------------------------------------*/ 

//ADMISSION
//REGISTER (UPDATED!)
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email) {
    return res.status(400).send({ message: "Please fill up all required form" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // First insert into person_table
    const query1 = 'INSERT INTO person_table () VALUES ()';
    const [result1] = await db.query(query1);
    const person_id = result1.insertId;

    // Second insert into user_accounts
    const query2 = 'INSERT INTO user_accounts (person_id, email, password) VALUES (?, ?, ?)';
    const [result2] = await db.query(query2, [person_id, email, hashedPassword]);

    res.status(201).send({ message: "Registered Successfully", person_id });
  } 
  catch (error) {
      // If any query fails, we rollback the first insert
      const rollback = 'DELETE FROM person_table WHERE person_id = ?';
      await db.query(rollback, [person_id]);

      res.status(500).send({ message: "Internal Server Error" });
  }
});

//GET ADMITTED USERS (UPDATED!)
app.get('/admitted_users', async (req, res) => {
    try{
      const query = 'SELECT * FROM user_accounts';
      const [result] = await db.query(query);

      res.status(200).send(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({message: 'INTERNAL SERVER ERROR!!' });
    }
});

//TRANSFER ENROLLED USER INTO ENROLLMENT (UPDATED!)
app.post('/transfer', async (req, res) => {
  const { person_id } = req.body;

  try {
    const fetchQuery = 'SELECT * FROM user_accounts WHERE person_id = ?';
    const [result1] = await db.query(fetchQuery, [person_id]);

    if (result1.length === 0) {
      return res.status(404).send({ message: 'User not found in the database' });
    }

    const user = result1[0];

    const insertPersonQuery = 'INSERT INTO person_table (first_name, middle_name, last_name) VALUES (?, ?, ?)';
    const [personResult] = await db3.query(insertPersonQuery, [
      user.first_name,
      user.middle_name,
      user.last_name
    ]);

    const newPersonId = personResult.insertId;

    const insertUserQuery = 'INSERT INTO user_accounts (person_id, email, password) VALUES (?, ?, ?)';
    await db3.query(insertUserQuery, [newPersonId, user.email, user.password]);

    console.log("User transferred successfully:", user.email);
    return res.status(200).send({ message: 'User transferred successfully', email: user.email });

  } catch (error) {
    console.error("ERROR: ", error);
    return res.status(500).send({ message: "Something went wrong in the server", error });
  }
});

// upload requirements
app.post('/upload', upload.single('file'), async (req, res) => {
  const { requirements_id, person_id } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const sql = `INSERT INTO requirement_uploads (requirements_id, person_id, file_path) VALUES (?, ?, ?)`;

  try {
    const [result] = await db.query(sql, [requirements_id, person_id, filePath]);
    res.status(201).json({ message: 'Upload successful', insertId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
});


app.get('/uploads', async (req, res) => {
  const query = `
    SELECT 
      ru.upload_id, 
      r.description, 
      ru.file_path, 
      ru.created_at
    FROM requirement_uploads ru
    JOIN requirements_table r ON ru.requirements_id = r.id
  `;

  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err });
  }
});





// GET THE APPLICANT REQUIREMENTS (UPDATED!)
app.get("/applicant-requirements", async (req, res) => {
  try{  
    const sql = `
      SELECT ar.id, ar.created_at, r.requirements_description AS title 
      FROM applicant_requirements ar
      JOIN requirements r ON ar.student_requirement_id = r.requirements_id
    `;

    const [result] = await db.query(sql);
    res.status(200).send(result);

  } catch (error) {

    console.error("Database Error:", error);
    res.status(500).json({ error: "Error fetching requirements" });
  }
});

// DELETE APPLICANT REQUIREMENTS (UPDATED!)
app.delete("/applicant-requirements/:id", async (req, res) => {
  const { id } = req.params;

  try {

    const [results] = await db.query(
      "SELECT file_path FROM applicant_requirements WHERE id = ?",
      [id]
    );

    if (results.length > 0 && results[0].file_path) {
      const filePath = path.join(__dirname, "uploads", results[0].file_path);

      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    const [deleteResult] = await db.query(
      "DELETE FROM applicant_requirements WHERE id = ?",
      [id]
    );

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    res.json({ message: "Requirement deleted successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to delete requirement" });
  }
});

// -------------------------------------------- GET APPLICANT ADMISSION DATA ------------------------------------------------//
app.get("/person_table", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM person_table");
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ message: "Error fetching Personal Information", error });
  }
});

// -------------------------------------------- TO ADD APPLICANT FORM ------------------------------------------------//
app.post("/person_table", async (req, res) => {
  const { 
    profile_picture, campus, academicProgram, classifiedAs, program, program2, program3, yearLevel,
    last_name, first_name, middle_name, extension, nickname, height, weight,
    lrnNumber, gender, pwdType, pwdId, birthOfDate, age, birthPlace,
    languageDialectSpoken, citizenship, religion, civilStatus, tribeEthnicGroup,
    cellphoneNumber, emailAddress, telephoneNumber, facebookAccount,
    presentStreet, presentBarangay, presentZipCode, presentRegion,
    presentProvince, presentMunicipality, presentDswdHouseholdNumber,
    permanentStreet, permanentBarangay, permanentZipCode, permanentRegion,
    permanentProvince, permanentMunicipality, permanentDswdHouseholdNumber,
    solo_parent, father_deceased, father_family_name, father_given_name,
    father_middle_name, father_ext, father_nickname, father_education_level,
    father_last_school, father_course, father_year_graduated, father_school_address,
    father_contact, father_occupation, father_employer, father_income, father_email,
    mother_deceased, mother_family_name, mother_given_name, mother_middle_name,
    mother_nickname, mother_education_level, mother_last_school, mother_course,
    mother_year_graduated, mother_school_address, mother_contact, mother_occupation,
    mother_employer, mother_income, mother_email, guardian,
    guardian_family_name, guardian_given_name, guardian_middle_name, guardian_ext,
    guardian_nickname, guardian_address, guardian_contact, guardian_email,
    annual_income, schoolLevel, schoolLastAttended, schoolAddress, courseProgram,
    honor, generalAverage, yearGraduated, strand, cough, colds, fever, asthma, fainting, heartDisease, tuberculosis, frequentHeadaches,
    hernia, chronicCough, headNeckInjury, hiv, highBloodPressure, diabetesMellitus, allergies, cancer,
    smoking, alcoholDrinking, hospitalized, hospitalizationDetails, medications, hadCovid, covidDate,
    vaccine1Brand, vaccine1Date, vaccine2Brand, vaccine2Date, booster1Brand, booster1Date, booster2Brand,
    booster2Date, chestXray, cbc, urinalysis, otherworkups, symptomsToday, remarks, termsOfAgreement
  } = req.body;

  const query = `
    INSERT INTO person_table (
      profile_picture, campus, academicProgram, classifiedAs, program, program2, program3, yearLevel,
      last_name, first_name, middle_name, extension, nickname, height, weight,
      lrnNumber, gender, pwdType, pwdId, birthOfDate, age, birthPlace,
      languageDialectSpoken, citizenship, religion, civilStatus, tribeEthnicGroup,
      cellphoneNumber, emailAddress, telephoneNumber, facebookAccount,
      presentStreet, presentBarangay, presentZipCode, presentRegion,
      presentProvince, presentMunicipality, presentDswdHouseholdNumber,
      permanentStreet, permanentBarangay, permanentZipCode, permanentRegion,
      permanentProvince, permanentMunicipality, permanentDswdHouseholdNumber,
      solo_parent, father_deceased, father_family_name, father_given_name,
      father_middle_name, father_ext, father_nickname, father_education_level,
      father_last_school, father_course, father_year_graduated, father_school_address,
      father_contact, father_occupation, father_employer, father_income, father_email,
      mother_deceased, mother_family_name, mother_given_name, mother_middle_name,
      mother_nickname, mother_education_level, mother_last_school, mother_course,
      mother_year_graduated, mother_school_address, mother_contact, mother_occupation,
      mother_employer, mother_income, mother_email, guardian,
      guardian_family_name, guardian_given_name, guardian_middle_name, guardian_ext,
      guardian_nickname, guardian_address, guardian_contact, guardian_email,
      annual_income, schoolLevel, schoolLastAttended, schoolAddress, courseProgram,
      honor, generalAverage, yearGraduated, strand, cough, colds, fever, asthma, fainting, heartDisease, tuberculosis, frequentHeadaches,
      hernia, chronicCough, headNeckInjury, hiv, highBloodPressure, diabetesMellitus, allergies, cancer,
      smoking, alcoholDrinking, hospitalized, hospitalizationDetails, medications, hadCovid, covidDate,
      vaccine1Brand, vaccine1Date, vaccine2Brand, vaccine2Date, booster1Brand, booster1Date, booster2Brand,
      booster2Date, chestXray, cbc, urinalysis, otherworkups, symptomsToday, remarks, termsOfAgreement
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(query, [
      profile_picture, campus, academicProgram, classifiedAs, program, program2, program3, yearLevel,
      last_name, first_name, middle_name, extension, nickname, height, weight,
      lrnNumber, gender, pwdType, pwdId, birthOfDate, age, birthPlace,
      languageDialectSpoken, citizenship, religion, civilStatus, tribeEthnicGroup,
      cellphoneNumber, emailAddress, telephoneNumber, facebookAccount,
      presentStreet, presentBarangay, presentZipCode, presentRegion,
      presentProvince, presentMunicipality, presentDswdHouseholdNumber,
      permanentStreet, permanentBarangay, permanentZipCode, permanentRegion,
      permanentProvince, permanentMunicipality, permanentDswdHouseholdNumber,
      solo_parent, father_deceased, father_family_name, father_given_name,
      father_middle_name, father_ext, father_nickname, father_education_level,
      father_last_school, father_course, father_year_graduated, father_school_address,
      father_contact, father_occupation, father_employer, father_income, father_email,
      mother_deceased, mother_family_name, mother_given_name, mother_middle_name,
      mother_nickname, mother_education_level, mother_last_school, mother_course,
      mother_year_graduated, mother_school_address, mother_contact, mother_occupation,
      mother_employer, mother_income, mother_email, guardian,
      guardian_family_name, guardian_given_name, guardian_middle_name, guardian_ext,
      guardian_nickname, guardian_address, guardian_contact, guardian_email,
      annual_income, schoolLevel, schoolLastAttended, schoolAddress, courseProgram,
      honor, generalAverage, yearGraduated, strand, cough, colds, fever, asthma, fainting, heartDisease, tuberculosis, frequentHeadaches,
      hernia, chronicCough, headNeckInjury, hiv, highBloodPressure, diabetesMellitus, allergies, cancer,
      smoking, alcoholDrinking, hospitalized, hospitalizationDetails, medications, hadCovid, covidDate,
      vaccine1Brand, vaccine1Date, vaccine2Brand, vaccine2Date, booster1Brand, booster1Date, booster2Brand,
      booster2Date, chestXray, cbc, urinalysis, otherworkups, symptomsToday, remarks,	termsOfAgreement
    ]);

    res.status(201).send({ message: "Personal information created", person_id: result.insertId });
  } catch (error) {
    res.status(500).send({ message: "Error creating personal information", error });
  }
});


// -------------------------------------------- UPDATE APPLICANT FORM ------------------------------------------------//
app.put("/person_table/:person_id", (req, res) => {
  const { person_id } = req.params;

  const {
    profile_picture, campus, academicProgram, classifiedAs, program, program2, program3, yearLevel,
    last_name, first_name, middle_name, extension, nickname, height, weight,
    lrnNumber, gender, pwdType, pwdId, birthOfDate, age, birthPlace,
    languageDialectSpoken, citizenship, religion, civilStatus, tribeEthnicGroup,
    otherEthnicGroup, cellphoneNumber, emailAddress, telephoneNumber, facebookAccount,
    presentStreet, presentBarangay, presentZipCode, presentRegion,
    presentProvince, presentMunicipality, presentDswdHouseholdNumber,
    permanentStreet, permanentBarangay, permanentZipCode, permanentRegion,
    permanentProvince, permanentMunicipality, permanentDswdHouseholdNumber,
    solo_parent, father_deceased, father_family_name, father_given_name,
    father_middle_name, father_ext, father_nickname, father_education_level,
    father_last_school, father_course, father_year_graduated, father_school_address,
    father_contact, father_occupation, father_employer, father_income, father_email,
    mother_deceased, mother_family_name, mother_given_name, mother_middle_name,
    mother_nickname, mother_education_level, mother_last_school, mother_course,
    mother_year_graduated, mother_school_address, mother_contact, mother_occupation,
    mother_employer, mother_income, mother_email, guardian,
    guardian_family_name, guardian_given_name, guardian_middle_name, guardian_ext,
    guardian_nickname, guardian_address, guardian_contact, guardian_email,
    annual_income, schoolLevel, schoolLastAttended, schoolAddress, courseProgram,
    honor, generalAverage, yearGraduated, strand, cough, colds, fever, asthma, faintingSpells, heartDisease, tuberculosis, frequentHeadaches,
    hernia, chronicCough, headNeckInjury, hiv, highBloodPressure, diabetesMellitus, allergies, cancer,
    smokingCigarette, alcoholDrinking, hospitalized, hospitalizationDetails, medications, hadCovid, covidDate,
    vaccine1Brand, vaccine1Date, vaccine2Brand, vaccine2Date, booster1Brand, booster1Date, booster2Brand,
    booster2Date, chestXray, cbc, urinalysis, otherworkups, symptomsToday, remarks, termsOfAgreement
  } = req.body;

  const updateQuery = `
    UPDATE person_table SET
      profile_picture = ?, campus = ?, academicProgram = ?, classifiedAs = ?, program = ?, program2 = ?, program3 = ?, yearLevel = ?,
      last_name = ?, first_name = ?, middle_name = ?, extension = ?, nickname = ?, height = ?, weight = ?,
      lrnNumber = ?, gender = ?, pwdType = ?, pwdId = ?, birthOfDate = ?, age = ?, birthPlace = ?,
      languageDialectSpoken = ?, citizenship = ?, religion = ?, civilStatus = ?, tribeEthnicGroup = ?,
      otherEthnicGroup = ?, cellphoneNumber = ?, emailAddress = ?, telephoneNumber = ?, facebookAccount = ?,
      presentStreet = ?, presentBarangay = ?, presentZipCode = ?, presentRegion = ?,
      presentProvince = ?, presentMunicipality = ?, presentDswdHouseholdNumber = ?,
      permanentStreet = ?, permanentBarangay = ?, permanentZipCode = ?, permanentRegion = ?,
      permanentProvince = ?, permanentMunicipality = ?, permanentDswdHouseholdNumber = ?,
      solo_parent = ?, father_deceased = ?, father_family_name = ?, father_given_name = ?,
      father_middle_name = ?, father_ext = ?, father_nickname = ?, father_education_level = ?,
      father_last_school = ?, father_course = ?, father_year_graduated = ?, father_school_address = ?,
      father_contact = ?, father_occupation = ?, father_employer = ?, father_income = ?, father_email = ?,
      mother_deceased = ?, mother_family_name = ?, mother_given_name = ?, mother_middle_name = ?,
      mother_nickname = ?, mother_education_level = ?, mother_last_school = ?, mother_course = ?,
      mother_year_graduated = ?, mother_school_address = ?, mother_contact = ?, mother_occupation = ?,
      mother_employer = ?, mother_income = ?, mother_email = ?, guardian = ?,
      guardian_family_name = ?, guardian_given_name = ?, guardian_middle_name = ?, guardian_ext = ?,
      guardian_nickname = ?, guardian_address = ?, guardian_contact = ?, guardian_email = ?,
      annual_income = ?, schoolLevel = ?, schoolLastAttended = ?, schoolAddress = ?, courseProgram = ?,
      honor = ?, generalAverage = ?, yearGraduated = ?, strand = ?, cough = ?, colds = ?, fever = ?,
      asthma = ?, faintingSpells = ?, heartDisease = ?, tuberculosis = ?, frequentHeadaches = ?,
      hernia = ?, chronicCough = ?, headNeckInjury = ?, hiv = ?, highBloodPressure = ?,
      diabetesMellitus = ?, allergies = ?, cancer = ?, smokingCigarette = ?, alcoholDrinking = ?, hospitalized = ?,
      hospitalizationDetails = ?, medications = ?, hadCovid = ?, covidDate = ?, vaccine1Brand = ?,
      vaccine1Date = ?, vaccine2Brand = ?, vaccine2Date = ?, booster1Brand = ?, booster1Date = ?,
      booster2Brand = ?, booster2Date = ?, chestXray = ?, cbc = ?, urinalysis = ?, otherworkups = ?,
      symptomsToday = ?, remarks = ?, termsOfAgreement = ?
    WHERE person_id = ?
  `;

  const values = [
    profile_picture, campus, academicProgram, classifiedAs, program, program2, program3, yearLevel,
    last_name, first_name, middle_name, extension, nickname, height, weight,
    lrnNumber, gender, pwdType, pwdId, birthOfDate, age, birthPlace,
    languageDialectSpoken, citizenship, religion, civilStatus, tribeEthnicGroup,
    otherEthnicGroup, cellphoneNumber, emailAddress, telephoneNumber, facebookAccount,
    presentStreet, presentBarangay, presentZipCode, presentRegion,
    presentProvince, presentMunicipality, presentDswdHouseholdNumber,
    permanentStreet, permanentBarangay, permanentZipCode, permanentRegion,
    permanentProvince, permanentMunicipality, permanentDswdHouseholdNumber,
    solo_parent, father_deceased, father_family_name, father_given_name,
    father_middle_name, father_ext, father_nickname, father_education_level,
    father_last_school, father_course, father_year_graduated, father_school_address,
    father_contact, father_occupation, father_employer, father_income, father_email,
    mother_deceased, mother_family_name, mother_given_name, mother_middle_name,
    mother_nickname, mother_education_level, mother_last_school, mother_course,
    mother_year_graduated, mother_school_address, mother_contact, mother_occupation,
    mother_employer, mother_income, mother_email, guardian,
    guardian_family_name, guardian_given_name, guardian_middle_name, guardian_ext,
    guardian_nickname, guardian_address, guardian_contact, guardian_email,
    annual_income, schoolLevel, schoolLastAttended, schoolAddress, courseProgram,
    honor, generalAverage, yearGraduated, strand, cough, colds, fever, asthma, faintingSpells, heartDisease, tuberculosis, frequentHeadaches,
    hernia, chronicCough, headNeckInjury, hiv, highBloodPressure, diabetesMellitus, allergies, cancer,
    smokingCigarette, alcoholDrinking, hospitalized, hospitalizationDetails, medications, hadCovid, covidDate,
    vaccine1Brand, vaccine1Date, vaccine2Brand, vaccine2Date, booster1Brand, booster1Date, booster2Brand,
    booster2Date, chestXray, cbc, urinalysis, otherworkups, symptomsToday, remarks, termsOfAgreement,
    person_id
  ];

  db.query(updateQuery, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // After update, fetch the updated record
    db.query("SELECT * FROM person_table WHERE person_id = ?", [person_id], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(results[0]); // Return the updated student object
    });
  });
});

// -------------------------------------------- DELETE APPLICANT FORM ------------------------------------------------//
app.delete("/person_table/:person_id", async (req, res) => {
  const { person_id } = req.params;

  try {
    await db.query("DELETE FROM person_table WHERE person_id = ?", [person_id]);
    res.status(200).send({ message: "Personal information deleted" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting personal information", error });
  }
});



/*---------------------------  ENROLLMENT -----------------------*/ 

// LOGIN PANEL (UPDATED!)
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  try {
    let user, token, mappings = [];
    
    if (role === "applicant" || role === "superadmin") {
      const [rows] = await db.query("SELECT * FROM user_accounts WHERE email = ?", [email]);

      if (rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      token = webtoken.sign(
        {
          id: user.id,
          person_id: user.person_id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "User login successful",
        token,
        user: {
          person_id: user.person_id,
          email: user.email,
          role: user.role
        }
      });

    } else if (role === "faculty") {
      const sql = `
        SELECT prof_table.*, time_table.*
        FROM prof_table
        LEFT JOIN time_table ON prof_table.prof_id = time_table.professor_id
        WHERE prof_table.email = ?
      `;
      const [results] = await db3.query(sql, [email]);

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      token = webtoken.sign(
        {
          prof_id: user.prof_id,
          fname: user.fname,
          mname: user.mname,
          lname: user.lname,
          email: user.email,
          role: user.role,
          school_year_id: user.school_year_id
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      mappings = results.map(row => ({
        department_section_id: row.department_section_id,
        subject_id: row.course_id
      }));

      return res.status(200).json({
        message: "Professor login successful",
        token,
        prof_id: user.prof_id,
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        email: user.email,
        role: user.role,
        subject_section_mappings: mappings,
        school_year_id: user.school_year_id
      });

    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});


//READ ENROLLED USERS (UPDATED!)
app.get('/enrolled_users',  async(req, res) => {  
  try {
    const query = 'SELECT * FROM user_accounts';
    
    const [result] = await db3.query(query);
    res.status(200).send(result);
  }
  catch(error){
    res.status(500).send({message: 'Error Fetching data from the server'});
  }
});

// DEPARTMENT CREATION (UPDATED!)
app.post('/department', async (req, res) => {
  const { dep_name, dep_code } = req.body;
  const query = 'INSERT INTO dprtmnt_table (dprtmnt_name, dprtmnt_code) VALUES (?, ?)';

  try {
      const [result] = await db3.query(query, [dep_name, dep_code]);
      res.status(200).send({ insertId: result.insertId });
  } catch (err) {
      console.error("Error creating department:", err);
      res.status(500).send({ error: "Failed to create department" });
  }
});

// DEPARTMENT LIST (UPDATED!)
app.get('/get_department', async (req, res) => {
  const getQuery = 'SELECT * FROM dprtmnt_table';

  try {
      const [result] = await db3.query(getQuery);
      res.status(200).send(result);
  } catch (err) {
      console.error("Error fetching departments:", err);
      res.status(500).send({ message: 'Internal Server Error' });
  }
});

// UPDATE DEPARTMENT INFORMATION (SUPERADMIN) (UPDATED!)
app.put('/update_department/:id', async (req, res) => {
  const { id } = req.params;  // Extract the department ID from the URL parameter
  const { dep_name, dep_code } = req.body;  // Get the department name and code from the request body

  const updateQuery = `
      UPDATE dprtmnt_table 
      SET dprtmnt_name = ?, dprtmnt_code = ? 
      WHERE id = ?`;

  try {
    const [result] = await db3.query(updateQuery, [dep_name, dep_code, id]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Department not found' });
    }

    res.status(200).send({ message: 'Department updated successfully' });
  } catch (err) {
    console.error('Error updating department:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// DELETE DEPARTMENT (SUPERADMIN) (UPDATED!)
app.delete('/delete_department/:id', async (req, res) => {
  const { id } = req.params;
  
  const deleteQuery = 'DELETE FROM dprtmnt_table WHERE id = ?';
  
  try {
    const [result] = await db3.query(deleteQuery, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Department not found' });
    }
    
    res.status(200).send({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error('Error deleting department:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// PROGRAM CREATION (UPDATED!)
app.post('/program', async (req, res) => {
  const { name, code } = req.body;
  
  const insertProgramQuery = 'INSERT INTO program_table (program_description, program_code) VALUES (?, ?)';
  
  try {
    const [result] = await db3.query(insertProgramQuery, [name, code]);
    res.status(200).send({ message: 'Program created successfully', result });
  } catch (err) {
    console.error('Error creating program:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// PROGRAM TABLE (UPDATED!)
app.get('/get_program', async (req, res) => {
  const programQuery = 'SELECT * FROM program_table';
  
  try {
    const [result] = await db3.query(programQuery);
    res.status(200).send(result);
  } catch (err) {
    console.error('Error fetching programs:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// UPDATE PROGRAM INFORMATION (SUPERADMIN)(UPDATED!)
app.put('/update_program/:id', async (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body;
  
  const updateQuery = 'UPDATE program_table SET program_description = ?, program_code = ? WHERE id = ?';
  
  try {
    const [result] = await db3.query(updateQuery, [name, code, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Program not found' });
    }
    
    res.status(200).send({ message: 'Program updated successfully' });
  } catch (err) {
    console.error('Error updating program:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// DELETE PROGRAM (SUPERADMIN) (UPDATED!)
app.delete('/delete_program/:id', async (req, res) => {
  const { id } = req.params;
  
  const deleteQuery = 'DELETE FROM program_table WHERE id = ?';
  
  try {
    const [result] = await db3.query(deleteQuery, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Program not found' });
    }
    
    res.status(200).send({ message: 'Program deleted successfully' });
  } catch (err) {
    console.error('Error deleting program:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});  

// CURRICULUM CREATION (UPDATED!)
app.post("/curriculum", async (req, res) => {
  const { year_id, program_id } = req.body;

  if (!year_id || !program_id) {
    return res.status(400).json({ error: "Year ID and Program ID are required" });
  }

  try {
    const sql = "INSERT INTO curriculum_table (year_id, program_id) VALUES (?, ?)";
    const [result] = await db3.query(sql, [year_id, program_id]);

    res.status(201).json({
      message: "Curriculum created successfully",
      curriculum_id: result.insertId
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
});

// CURRICULUM LIST (UPDATED!)
app.get("/get_curriculum", async (req, res) => {
  const readQuery = `
    SELECT ct.*, p.*, y.* 
    FROM curriculum_table ct 
    INNER JOIN program_table p ON ct.program_id = p.program_id
    INNER JOIN year_table y ON ct.year_id = y.year_id
  `;

  try {
    const [result] = await db3.query(readQuery);
    res.status(200).json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
});

// UPDATE CURRICULUM (SUPERADMIN)

// DELETE CURRICULUM (SUPERADMIN)

/// COURSE TABLE - ADDING COURSE (UPDATED!)
app.post("/adding_course", async (req, res) => {
  const { course_code, course_description, course_unit, lab_unit } = req.body;

  // Basic validation
  if (!course_code || !course_description || !course_unit || !lab_unit) {
    return res.status(400).json({ error: "All course fields are required" });
  }

  const courseQuery = `
    INSERT INTO course_table (course_code, course_description, course_unit, lab_unit)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await db3.query(courseQuery, [
      course_code,
      course_description,
      course_unit,
      lab_unit
    ]);

    res.status(201).json({
      message: "Course added successfully",
      course_id: result.insertId
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
});

// READ COURSE LIST (UPDATED!)  
app.get("/prgram_tagging_list", async (req, res) => {
  const readQuery = `
     SELECT 
      pt.program_tagging_id,
      c.year_id AS curriculum_description,
      co.course_code,
      co.course_description,
      yl.year_level_description,
      s.semester_description
    FROM 
      program_tagging_table pt
    JOIN curriculum_table c ON pt.curriculum_id = c.curriculum_id
    JOIN course_table co ON pt.course_id = co.course_id
    JOIN year_level_table yl ON pt.year_level_id = yl.year_level_id
    JOIN semester_table s ON pt.semester_id = s.semester_id
  `;

  try {
    const [result] = await db3.query(readQuery);
    res.status(200).json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
});

// UPDATE COURSE (SUPERADMIN)

// DELETE COURSE (SUPERADMIN)

// GET COURSES BY CURRICULUM ID (UPDATED!)
app.get("/get_courses_by_curriculum/:curriculum_id", async (req, res) => {
  const { curriculum_id } = req.params;

  const query = `
    SELECT c.* 
    FROM program_tagging_table pt
    INNER JOIN course_table c ON pt.course_id = c.course_id
    WHERE pt.curriculum_id = ?
  `;

  try {
    const [result] = await db3.query(query, [curriculum_id]);
    res.status(200).json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Failed to retrieve courses",
      details: err.message
    });
  }
});

// COURSE TAGGING LIST (UPDATED!)
app.get("/get_course", async (req, res) => {
  const getCourseQuery = `
    SELECT 
      yl.*, st.*, c.*
    FROM program_tagging_table pt
    INNER JOIN year_level_table yl ON pt.year_level_id = yl.year_level_id
    INNER JOIN semester_table st ON pt.semester_id = st.semester_id
    INNER JOIN course_table c ON pt.course_id = c.course_id
  `;

  try {
    const [results] = await db3.query(getCourseQuery);
    res.status(200).json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Failed to retrieve course tagging list",
      details: err.message
    });
  }
});

// COURSE LIST (UPDATED!)
app.get("/course_list", async (req, res) => {
  const query = "SELECT * FROM course_table";

  try {
    const [result] = await db3.query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({
      error: "Query failed",
      details: err.message
    });
  }
});

// PROGRAM TAGGING TABLE (UPDATED!)
app.post("/program_tagging", async (req, res) => {
  const { curriculum_id, year_level_id, semester_id, course_id } = req.body;

  if (!curriculum_id || !year_level_id || !semester_id || !course_id) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const progTagQuery = `
    INSERT INTO program_tagging_table 
    (curriculum_id, year_level_id, semester_id, course_id) 
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await db3.query(progTagQuery, [
      curriculum_id,
      year_level_id,
      semester_id,
      course_id,
    ]);
    res.status(200).json({ message: "Program tagged successfully", insertId: result.insertId });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Failed to tag program",
      details: err.message,
    });
  }
});

// YEAR TABLE (UPDATED!)
app.post("/years", async (req, res) => {
  const { year_description } = req.body;

  if (!year_description) {
    return res.status(400).json({ error: "year_description is required" });
  }

  const query = "INSERT INTO year_table (year_description, status) VALUES (?, 0)";

  try {
    const [result] = await db3.query(query, [year_description]);
    res.status(201).json({
      year_id: result.insertId,
      year_description,
      status: 0
    });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({
      error: "Insert failed",
      details: err.message
    });
  }
});

// YEAR LIST (UPDATED!)
app.get("/year_table", async (req, res) => {
  const query = "SELECT * FROM year_table";

  try {
    const [result] = await db3.query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({
      error: "Query failed",
      details: err.message
    });
  }
});

// UPDATE YEAR PANEL INFORMATION (UPDATED!)
app.put("/year_table/:id", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    if (status === 1) {
      // Deactivate all other years first
      const deactivateQuery = "UPDATE year_table SET status = 0";
      await db3.query(deactivateQuery);

      // Activate the selected year
      const activateQuery = "UPDATE year_table SET status = 1 WHERE year_id = ?";
      await db3.query(activateQuery, [id]);

      res.status(200).json({ message: "Year status updated successfully" });
    } else {
      // Deactivate the selected year
      const updateQuery = "UPDATE year_table SET status = 0 WHERE year_id = ?";
      await db3.query(updateQuery, [id]);

      res.status(200).json({ message: "Year deactivated successfully" });
    }
  } catch (err) {
    console.error("Error updating year status:", err);
    res.status(500).json({
      error: "Failed to update year status",
      details: err.message,
    });
  }
});

// YEAR LEVEL PANEL (UPDATED!)
app.post("/years_level", async (req, res) => {
  const { year_level_description } = req.body;

  if (!year_level_description) {
    return res.status(400).json({ error: "year_level_description is required" });
  }

  const query = "INSERT INTO year_level_table (year_level_description) VALUES (?)";

  try {
    const [result] = await db3.query(query, [year_level_description]);
    res.status(201).json({
      year_level_id: result.insertId,
      year_level_description,
    });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Insert failed", details: err.message });
  }
});
  
// YEAR LEVEL TABLE (UPDATED!)
app.get('/get_year_level', async (req, res) => {
  const query = 'SELECT * FROM year_level_table';

  try {
    const [result] = await db3.query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Failed to retrieve year level data", details: err.message });
  }
});

// SEMESTER PANEL (UPDATED!)
app.post("/semesters", async (req, res) => {
  const { semester_description } = req.body;

  if (!semester_description) {
    return res.status(400).json({ error: "semester_description is required" });
  }

  const query = "INSERT INTO semester_table (semester_description) VALUES (?)";

  try {
    const [result] = await db3.query(query, [semester_description]);
    res.status(201).json({
      semester_id: result.insertId,
      semester_description,
    });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Insert failed", details: err.message });
  }
});

// SEMESTER TABLE (UPDATED!)
app.get('/get_semester', async (req, res) => {
  const query = 'SELECT * FROM semester_table';

  try {
    const [result] = await db3.query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Query failed", details: err.message });
  }
});

// GET SCHOOL YEAR (UPDATED!)
app.get("/school_years", async (req, res) => {
  const query = `
    SELECT sy.*, yt.year_description, s.semester_description, 
    FROM active_school_year_table sy
    JOIN year_table yt ON sy.year_id = yt.year_id
    JOIN semester_table s ON sy.semester_id = s.semester_id
  `;

  try {
    const [result] = await db3.query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch school years", details: err.message });
  }
});

// SCHOOL YEAR PANEL (UPDATED!)
app.post("/school_years", async (req, res) => {
  const { year_id, semester_id, activator } = req.body;

  if (!year_id || !semester_id) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // If activating a school year, deactivate all others first
    if (activator === 1) {
      const deactivateQuery = `UPDATE active_school_year_table SET astatus = 0`;
      await db3.query(deactivateQuery);
    }

    // Insert new school year record
    const insertQuery = `
      INSERT INTO active_school_year_table (year_id, semester_id, astatus, active)
      VALUES (?, ?, ?, 0)
    `;
    const [result] = await db3.query(insertQuery, [year_id, semester_id, activator]);

    res.status(201).json({ school_year_id: result.insertId });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to process the school year", details: err.message });
  }
});

// UPDATE SCHOOL YEAR INFORMATION (UPDATED!)
app.put("/school_years/:id", async (req, res) => {
  const { id } = req.params;
  const { activator } = req.body;

  try {
    if (parseInt(activator) === 1) {
      // First deactivate all, then activate the selected one
      const deactivateAllQuery = "UPDATE active_school_year_table SET astatus = 0";
      await db3.query(deactivateAllQuery);

      const activateQuery = "UPDATE active_school_year_table SET astatus = 1 WHERE id = ?";
      await db3.query(activateQuery, [id]);

      return res.status(200).json({ message: "School year activated and others deactivated" });
    } else {
      // Just deactivate the selected one
      const query = "UPDATE active_school_year_table SET astatus = 0 WHERE id = ?";
      await db3.query(query, [id]);

      return res.status(200).json({ message: "School year deactivated" });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update school year", details: err.message });
  }
});

// ROOM CREATION (UPDATED!)
app.post('/room', async (req, res) => {
  const {room_name} = req.body;

  try{
    const insertQuery = 'INSERT INTO room_table (room_description) VALUES (?)';
    const [result] = await db3.query(insertQuery, [room_name]);
    res.status(200).send({message: 'Room Successfully Created', result});
  }catch(error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.get('/room_list', async (req, res) => {
  try {
    const getQuery = 'SELECT * FROM room_table';
    const [result] = await db3.query(getQuery);
    res.status(200).send(result);
  } catch(err){
    console.error(err);
    res.status(500).send(err);
  }
})

// ROOM LIST (UPDATED!)
app.get('/get_room', async (req, res) => {
  const { department_id } = req.query;

  if (!department_id) {
      return res.status(400).json({ error: "Department ID is required" });
  }

  const getRoomQuery = `
      SELECT r.room_id, r.room_description, d.dprtmnt_name
      FROM room_table r
      INNER JOIN dprtmnt_room_table drt ON r.room_id = drt.room_id
      INNER JOIN dprtmnt_table d ON drt.dprtmnt_id = d.dprtmnt_id
      WHERE drt.dprtmnt_id = ?
  `;

  try {
      const [result] = await db3.query(getRoomQuery, [department_id]);
      res.status(200).json(result);
  } catch (err) {
      console.error("Error fetching rooms:", err);
      res.status(500).json({ error: "Failed to fetch rooms", details: err.message });
  }
});

// UPDATE ROOM (SUPERADMIN)

// DELETE ROOM (SUPERADMIN)

// DEPARTMENT ROOM PANEL (UPDATED!)
app.get('/api/assignments', async (req, res) => {
  const query = `
    SELECT 
      drt.dprtmnt_room_id, 
      dt.dprtmnt_id, 
      dt.dprtmnt_name, 
      dt.dprtmnt_code, 
      rt.room_description
    FROM dprtmnt_room_table drt
    INNER JOIN dprtmnt_table dt ON drt.dprtmnt_id = dt.dprtmnt_id
    INNER JOIN room_table rt ON drt.room_id = rt.room_id
  `;

  try {
    const [results] = await db3.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ error: "Failed to fetch assignments", details: err.message });
  }
});

// POST ROOM DEPARTMENT (UPDATED!)
app.post('/api/assign', async (req, res) => {
  const { dprtmnt_id, room_id } = req.body;

  if (!dprtmnt_id || !room_id) {
    return res.status(400).json({ message: 'Department and Room ID are required' });
  }

  try {
    // Check if the room is already assigned to the department
    const checkQuery = `
      SELECT * FROM dprtmnt_room_table 
      WHERE dprtmnt_id = ? AND room_id = ?
    `;
    const [checkResults] = await db3.query(checkQuery, [dprtmnt_id, room_id]);

    if (checkResults.length > 0) {
      return res.status(400).json({ message: 'Room already assigned to this department' });
    }

    // Assign the room to the department
    const insertQuery = `
      INSERT INTO dprtmnt_room_table (dprtmnt_id, room_id)
      VALUES (?, ?)
    `;
    const [insertResult] = await db3.query(insertQuery, [dprtmnt_id, room_id]);

    return res.json({ message: 'Room successfully assigned to department', insertId: insertResult.insertId });
  } catch (err) {
    console.error("Error assigning room:", err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.delete('/api/unassign/:room_id', async (req, res) => {
  const { room_id } = req.params;

  if (!room_id) {
    return res.status(400).json({ message: 'Room ID is required' });
  }

  try {
    const deleteQuery = `
      DELETE FROM dprtmnt_room_table WHERE room_id = ?
    `;
    const [result] = await db3.query(deleteQuery, [room_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found in assignments' });
    }

    return res.json({ message: 'Room successfully unassigned' });
  } catch (err) {
    console.error('Error unassigning room:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


// SECTIONS (UPDATED!)
app.post('/section_table', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const query = 'INSERT INTO section_table (description) VALUES (?)';
    const [result] = await db3.query(query, [description]);
    res.status(201).json({ message: 'Section created successfully', sectionId: result.insertId });
  } catch (err) {
    console.error('Error inserting section:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// SECTIONS LIST (UPDATED!)
app.get('/section_table', async (req, res) => {
  try {
    const query = 'SELECT * FROM section_table';
    const [result] = await db3.query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching sections:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// UPDATE SECTIONS (SUPERADMIN)

// DELETE SECTIONS (SUPERADMIN)

// DEPARTMENT SECTIONS (UPDATED!)
app.post('/department_section', async (req, res) => {
  const { curriculum_id, section_id } = req.body;

  if (!curriculum_id || !section_id) {
    return res.status(400).json({ error: 'Curriculum ID and Section ID are required' });
  }

  try {
    const query = 'INSERT INTO dprtmnt_section_table (curriculum_id, section_id, dsstat) VALUES (?, ?, 0)';
    const [result] = await db3.query(query, [curriculum_id, section_id]);
    
    res.status(201).json({ message: 'Department section created successfully', sectionId: result.insertId });
  } catch (err) {
    console.error('Error inserting department section:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.get('/department_section', async (req, res) => {
  try {
    const query = `
      SELECT 
        pt.program_code,  
        yt.year_description,
        st.description AS section_description
      FROM dprtmnt_section_table dst
      INNER JOIN curriculum_table ct ON dst.curriculum_id = ct.curriculum_id
      INNER JOIN program_table pt ON ct.program_id = pt.program_id
      INNER JOIN year_table yt ON ct.year_id = yt.year_id
      INNER JOIN section_table st ON dst.section_id = st.id
    `;

    const [rows] = await db3.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// PROFESSOR REGISTRATION (UPDATED!)
app.post('/register_prof', async (req, res) => {
  const { fname, mname, lname, email, password } = req.body;

  // Validate input
  if (!fname || !lname || !email || !password) {
    return res.status(400).json({ error: 'First name, last name, email, and password are required' });
  }

  try {
    // Hash password
    const hashedProfPassword = await bcrypt.hash(password, 10);

    // Insert professor into the database
    const queryForProf = 'INSERT INTO prof_table (fname, mname, lname, email, password, status) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db3.query(queryForProf, [fname, mname, lname, email, hashedProfPassword, 0]);

    // Return success response
    res.status(201).json({
      message: 'Professor registered successfully',
      professorId: result.insertId,
    });

  } catch (err) {
    // Log the error and return an error response
    console.error('Error registering professor:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      details: err.message,
    });
  }
});

// LOGIN PROFESSOR (UPDATED!)
app.post("/login_prof", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Fetch professor details and related time table records
    const sql = `
      SELECT prof_table.*, time_table.*
      FROM prof_table
      LEFT JOIN time_table ON prof_table.prof_id = time_table.professor_id
      WHERE prof_table.email = ?
    `;
    const [results] = await db3.query(sql, [email]);
    console.log("Query result:", results);
    // If no matching professor found
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    // Check if the password matches
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = webtoken.sign(
      { 
        prof_id: user.prof_id, 
        fname: user.fname, 
        mname: user.mname, 
        lname: user.lname, 
        email: user.email, 
        role: user.role,
        school_year_id: user.school_year_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Log the login attempt (for debugging purposes)
    console.log("Login response:", { token, prof_id: user.prof_id, email: user.email });

    // Prepare subject-section mappings
    const mappings = results.map(row => ({
      department_section_id: row.department_section_id,
      subject_id: row.course_id
    }));

    // Send successful login response with token and user details
    res.json({
      message: "Login successful",
      token,
      prof_id: user.prof_id,
      fname: user.fname, 
      mname: user.mname, 
      lname: user.lname, 
      email: user.email,
      role: user.role,
      subject_section_mappings: mappings,
      school_year_id: user.school_year_id
    });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: "Internal server error", details: err.message });
  }
});

// GET ENROLLED STUDENTS (UPDATED!)
app.get('/get_enrolled_students/:subject_id/:department_section_id/:active_school_year_id', async (req, res) => {
  const { subject_id, department_section_id, active_school_year_id } = req.params;

  // Validate the inputs
  if (!subject_id || !department_section_id || !active_school_year_id) {
    return res.status(400).json({ message: 'Subject ID, Department Section ID, and Active School Year ID are required.' });
  }

  const filterStudents = `
    SELECT person_table.*, enrolled_subject.*, time_table.*
    FROM time_table
    INNER JOIN enrolled_subject
        ON time_table.course_id = enrolled_subject.course_id
        AND time_table.department_section_id = enrolled_subject.department_section_id
        AND time_table.school_year_id = enrolled_subject.active_school_year_id
    INNER JOIN student_numbering_table
        ON enrolled_subject.student_number = student_numbering_table.student_number
    INNER JOIN person_table
        ON student_numbering_table.person_id = person_table.person_id
    WHERE time_table.course_id = ? 
        AND time_table.department_section_id = ? 
        AND time_table.school_year_id = ?
  `;

  try {
    // Execute the query using promise-based `execute` method
    const [result] = await db3.execute(filterStudents, [subject_id, department_section_id, active_school_year_id]);

    // Check if no students were found
    if (result.length === 0) {
      return res.status(404).json({ message: "No students found for this subject-section combination." });
    }

    // Send the response with the result
    res.json({
      totalStudents: result.length,
      students: result
    });

  } catch (err) {
    console.error("Query failed:", err);
    return res.status(500).json({ message: "Server error while fetching students." });
  }
});

// UPDATE ENROLLED STUDENT'S GRADES (UPDATED!)
app.put('/add_grades', async (req, res) => {
  const { midterm, finals, final_grade, en_remarks, student_number, subject_id } = req.body;
  console.log('Received data:', { midterm, finals, final_grade, en_remarks, student_number, subject_id });

  // SQL query to update grades
  const sql = `
    UPDATE enrolled_subject 
    SET midterm = ?, finals = ?, final_grade = ?, en_remarks = ?
    WHERE student_number = ? AND course_id = ?
  `;

  try {
      // Execute the query with await to handle the promise
      const [result] = await db3.execute(sql, [midterm, finals, final_grade, en_remarks, student_number, subject_id]);

      // Check if any rows were affected (i.e., if the update was successful)
      if (result.affectedRows > 0) {
          res.status(200).json({ message: "Grades updated successfully!" });
      } else {
          res.status(404).json({ message: "No matching record found to update." });
      }
  } catch (err) {
      console.error("Failed to update grades:", err);
      res.status(500).json({ message: "Server error" });
  }
});

// PROFESSOR LIST (UPDATED!)
app.get('/get_prof', async (req, res) => {
  const { department_id } = req.query;

  // Validate the input
  if (!department_id) {
      return res.status(400).json({ message: 'Department ID is required.' });
  }

  const getProfQuery = `
  SELECT p.*, d.dprtmnt_name
  FROM prof_table p
  INNER JOIN dprtmnt_profs_table dpt ON p.prof_id = dpt.prof_id
  INNER JOIN dprtmnt_table d ON dpt.dprtmnt_id = d.dprtmnt_id
  WHERE dpt.dprtmnt_id = ?
  `;

  try {
      // Execute the query using promise-based `execute` method
      const [result] = await db3.execute(getProfQuery, [department_id]);

      // Send the response with the result
      res.status(200).json(result);

  } catch (err) {
      console.error("Error fetching professors:", err);
      return res.status(500).json({ message: 'Server error while fetching professors.' });
  }
});

// prof filter
app.get('/prof_list/:dprtmnt_id', async (req, res) => {
  const {dprtmnt_id} = req.params;

  try{
    const query = `SELECT pt.* FROM dprtmnt_profs_table as dpt
                  INNER JOIN prof_table as pt 
                  ON dpt.prof_id = pt.prof_id
                  INNER JOIN dprtmnt_table as dt
                  ON dt.dprtmnt_id = dpt.dprtmnt_id
                  WHERE dpt.dprtmnt_id = ? `;
    const [results] = await db3.query(query, [dprtmnt_id]);
    res.status(200).send(results);
  } catch(error) {
    console.error(error);
    res.status(500).send(error);
  }
})

app.get('/room_list/:dprtmnt_id', async (req, res) => {
  const {dprtmnt_id} = req.params;

  try{
    const query = `SELECT rt.* FROM dprtmnt_room_table as drt
                  INNER JOIN room_table as rt 
                  ON drt.room_id = rt.room_id
                  INNER JOIN dprtmnt_table as dt
                  ON dt.dprtmnt_id = drt.dprtmnt_id
                  WHERE drt.dprtmnt_id = ? `;
    const [results] = await db3.query(query, [dprtmnt_id]);
    res.status(200).send(results);
  } catch(error) {
    console.error(error);
    res.status(500).send(error);
  }
})

app.get('/section_table/:dprtmnt_id', async (req, res) => {
  const { dprtmnt_id } = req.params;

  try {
    const query = `
      SELECT st.*
      FROM dprtmnt_curriculum_table AS dct
      INNER JOIN dprtmnt_section_table AS dst ON dct.curriculum_id = dst.curriculum_id
      INNER JOIN section_table AS st ON dst.section_id = st.id
      WHERE dct.dprtmnt_id = ?;
    `;
    
    const [results] = await db3.query(query, [dprtmnt_id]);
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});



app.get('/day_list', async (req, res) => {
  try{
    const query = 'SELECT * FROM room_day_table';
    const [result] = await db3.query(query);
    res.status(200).send(result)
  }catch(error){
    console.error(error);
    res.status(500).send(error);
  }
})

// REQUIREMENTS PANEL (UPDATED!)
app.post("/requirements", async (req, res) => {
  const { requirements_description } = req.body;

  // Validate the input
  if (!requirements_description) {
    return res.status(400).json({ error: "Description required" });
  }

  const query = "INSERT INTO requirements_table (requirements_description) VALUES (?)";

  try {
    // Execute the query using promise-based `execute` method
    const [result] = await db.execute(query, [requirements_description]);

    // Respond with the inserted ID
    res.status(201).json({ requirements_id: result.insertId });

  } catch (err) {
    console.error("Insert error:", err);
    return res.status(500).json({ error: "Failed to save requirement" });
  }
});

// GET THE REQUIREMENTS (UPDATED!)
app.get("/requirements", async (req, res) => {
  const query = "SELECT * FROM requirements_table";

  try {
    // Execute the query using promise-based `execute` method
    const [results] = await db.execute(query);

    // Send the results in the response
    res.json(results);

  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch requirements" });
  }
});

// DELETE (REQUIREMNET PANEL)
app.delete("/requirements_table/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM requirements_table WHERE requirements_id = ?";

  try {
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    res.status(200).json({ message: "Requirement deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete requirement" });
  }
});

//SCHEDULE CHECKER
app.post("/api/check-subject", async (req, res) => {
  const { section_id, school_year_id, prof_id, subject_id } = req.body;

  if (!section_id || !school_year_id || !subject_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    SELECT * FROM schedule 
    WHERE section_id = ? AND school_year_id = ? AND course_id = ?
  `;

  try {
    const [result] = await db.query(query, [section_id, school_year_id, subject_id]);

    if (result.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/check-conflict", async (req, res) => {
  const { day, start_time, end_time, section_id, school_year_id, prof_id, room_id, subject_id } = req.body;

  try {
    // Step 1: Check if the section + subject + school year is already assigned to another professor
    const checkSubjectQuery = `
      SELECT * FROM schedule 
      WHERE section_id = ? AND course_id = ? AND school_year_id = ? AND prof_id != ? 
    `;
    const [subjectResult] = await db.query(checkSubjectQuery, [section_id, subject_id, school_year_id, prof_id]);

    if (subjectResult.length > 0) {
      return res.status(409).json({ conflict: true, message: "This subject is already assigned to another professor in this section and school year." });
    }

    // Step 2: Check for overlapping time conflicts
    const checkTimeQuery = `
      SELECT * FROM schedule 
      WHERE day = ? 
      AND school_year_id = ?
      AND (prof_id = ? OR section_id = ? OR room_id = ?) 
      AND (
        (? >= start_time AND ? < end_time) OR  
        (? > start_time AND ? <= end_time) OR  
        (start_time >= ? AND start_time < ?) OR  
        (end_time > ? AND end_time <= ?)  
      )
    `;

    const [timeResult] = await db.query(checkTimeQuery, [
      day,
      school_year_id,
      prof_id,
      section_id,
      room_id,
      start_time,
      start_time,
      end_time,
      end_time,
      start_time,
      end_time,
      start_time,
      end_time
    ]);

    if (timeResult.length > 0) {
      return res.status(409).json({ conflict: true, message: "Schedule conflict detected! Please choose a different time." });
    }

    return res.status(200).json({ conflict: false, message: "Schedule is available." });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// INSERT SCHEDULE
app.post("/api/insert-schedule", async (req, res) => {
  const { day, start_time, end_time, section_id, subject_id, prof_id, room_id, school_year_id} = req.body;

  if (!day || !start_time || !end_time || !section_id || !school_year_id || !prof_id || !room_id || !subject_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO time_table (room_day, school_time_start, school_time_end, department_section_id, course_id, professor_id, department_room_id, school_year_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await db3.query(query, [day, start_time, end_time, section_id, subject_id, prof_id, room_id, school_year_id,]);
    res.status(200).json({ message: "Schedule inserted successfully" });
  } catch (error) {
    console.error("Error inserting schedule:", error);
    res.status(500).json({ error: "Failed to insert schedule" });
  }
}); 

// STUDENT NUMBERING

// GET STUDENTS THAT HAVE NO STUDENT NUMBER (UPDATED!)
app.get("/api/persons", async (req, res) => {
  try {
    // Execute the query using the promise-based API
    const [rows] = await db3.execute(`
      SELECT p.* 
      FROM person_table p
      JOIN person_status_table ps ON p.person_id = ps.person_id
      WHERE ps.student_registration_status = 0
    `);

    // Send the result as JSON
    res.json(rows);

  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send("Server error");
  }
});

// ASSIGN A STUDENT NUMBER TO THAT STUDENT (UPDATED!)
app.post("/api/assign-student-number", async (req, res) => {
  const connection = await db3.getConnection();
  
  try {
    const { person_id } = req.body;

    if (!person_id) {
      return res.status(400).send("person_id is required");
    }

    await connection.beginTransaction();

    // Get active year
    const [yearRows] = await connection.query("SELECT * FROM year_table WHERE status = 1 LIMIT 1");
    if (yearRows.length === 0) {
      await connection.rollback();
      return res.status(400).send("No active year found");
    }
    const year = yearRows[0];

    // Get counter
    const [counterRows] = await connection.query("SELECT * FROM student_counter WHERE id = 1");
    if (counterRows.length === 0) {
      await connection.rollback();
      return res.status(400).send("No counter found");
    }
    let que_number = counterRows[0].que_number;

    // Fix: if que_number is 0, still generate '00001'
    que_number = que_number + 1;

    let numberStr = que_number.toString();
    while (numberStr.length < 5) {
      numberStr = "0" + numberStr;
    }
    const student_number = `${year.year_description}${numberStr}`;

    // Check if already assigned
    const [existingRows] = await connection.query("SELECT * FROM student_numbering_table WHERE person_id = ?", [person_id]);
    if (existingRows.length > 0) {
      await connection.rollback();
      return res.status(400).send("Student number already assigned.");
    }

    // Insert into student_numbering
    await connection.query("INSERT INTO student_numbering_table (student_number, person_id) VALUES (?, ?)", [student_number, person_id]);

    // Update counter
    await connection.query("UPDATE student_counter SET que_number = ?", [que_number]);

    // Update person_status_table
    await connection.query("UPDATE person_status_table SET student_registration_status = 1 WHERE person_id = ?", [person_id]);

    await connection.commit();
    res.json({ student_number });
  } catch (err) {
    await connection.rollback();
    console.error("Server error:", err);
    res.status(500).send("Server error");
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

// Corrected route with parameter (UPDATED!)
app.get("/courses/:currId", async (req, res) => {
  const { currId } = req.params;

  const sql = `
    SELECT 
      ctt.program_tagging_id,
      ctt.curriculum_id,
      ctt.course_id,
      ctt.year_level_id,
      ctt.semester_id,
      s.course_code,
      s.course_description
    FROM program_tagging_table AS ctt
    INNER JOIN course_table AS s ON s.course_id = ctt.course_id

    WHERE ctt.curriculum_id = ?
    ORDER BY s.course_id ASC
  `;

  try {
    const [result] = await db3.query(sql, [currId]);
    res.json(result);
  } catch (err) {
    console.error("Error in /courses:", err);
    console.log(currId, "hello world");
    return res.status(500).json({ error: err.message });
  }
});

//(UPDATED!)
app.get("/enrolled_courses/:userId/:currId", async (req, res) => {
  const { userId, currId } = req.params;

  try {
    // Step 1: Get the active_school_year_id
    const activeYearSql = `SELECT id FROM active_school_year_table WHERE astatus = 1 LIMIT 1`;
    const [yearResult] = await db3.query(activeYearSql);

    if (yearResult.length === 0) {
      return res.status(404).json({ error: "No active school year found" });
    }

    const activeSchoolYearId = yearResult[0].id;

    const sql = `
    SELECT 
      es.id,
      es.course_id,
      c.course_code,
      c.course_description,
      st.description,
      ds.id AS department_section_id,
      pt.program_code,
      IFNULL(rd.description, 'TBA') AS day_description,
      IFNULL(tt.school_time_start, 'TBA') AS school_time_start,
      IFNULL(tt.school_time_end, 'TBA') AS school_time_end,
      IFNULL(rtbl.room_description, 'TBA') AS room_description,
      IFNULL(prof_table.lname, 'TBA') AS lname,

      (
        SELECT COUNT(*) 
        FROM enrolled_subject es2 
        WHERE es2.active_school_year_id = es.active_school_year_id 
          AND es2.department_section_id = es.department_section_id
          AND es2.course_id = es.course_id
      ) AS number_of_enrolled

    FROM enrolled_subject AS es
    INNER JOIN course_table AS c
      ON c.course_id = es.course_id
    INNER JOIN dprtmnt_section_table AS ds
      ON ds.id = es.department_section_id
    INNER JOIN section_table AS st
      ON st.id = ds.section_id
    INNER JOIN curriculum_table AS cr
      ON cr.curriculum_id = ds.curriculum_id
    INNER JOIN program_table AS pt
      ON pt.program_id = cr.program_id
    LEFT JOIN time_table AS tt
      ON tt.school_year_id = es.active_school_year_id 
      AND tt.department_section_id = es.department_section_id 
      AND tt.course_id = es.course_id 
    LEFT JOIN room_day_table AS rd
      ON rd.id = tt.room_day
    LEFT JOIN dprtmnt_room_table as dr
      ON dr.dprtmnt_room_id = tt.department_room_id
    LEFT JOIN room_table as rtbl
      ON rtbl.room_id = dr.room_id
    LEFT JOIN prof_table 
      ON prof_table.prof_id = tt.professor_id
    WHERE es.student_number = ? 
      AND es.active_school_year_id = ?
      AND es.curriculum_id = ?
    ORDER BY c.course_id ASC;
    `;

    const [result] = await db3.query(sql, [userId, activeSchoolYearId, currId]);
    res.json(result);
  } catch (err) {
    console.error("Error in /enrolled_courses:", err);
    return res.status(500).json({ error: err.message });
  }
});

//(UPDATED!)
app.post("/add-all-to-enrolled-courses", async (req, res) => {
  const { subject_id, user_id, curriculumID, departmentSectionID } = req.body;
  console.log("Received request:", { subject_id, user_id, curriculumID, departmentSectionID });

  try {
    const activeYearSql = `SELECT id, semester_id FROM active_school_year_table WHERE astatus = 1 LIMIT 1`;
    const [yearResult] = await db3.query(activeYearSql);

    if (yearResult.length === 0) {
      return res.status(404).json({ error: "No active school year found" });
    }

    const activeSchoolYearId = yearResult[0].id;
    const activeSemesterId = yearResult[0].semester_id;
    console.log("Active semester ID:", activeSemesterId);

    const checkSql = `
      SELECT year_level_id, semester_id, curriculum_id 
      FROM program_tagging_table 
      WHERE course_id = ? AND curriculum_id = ? 
      LIMIT 1
    `;

    const [checkResult] = await db3.query(checkSql, [subject_id, curriculumID]);

    if (!checkResult.length) {
      console.warn(`Subject ${subject_id} not found in tagging table`);
      return res.status(404).json({ message: "Subject not found" });
    }

    const { year_level_id, semester_id, curriculum_id } = checkResult[0];
    console.log("Year level found:", year_level_id);
    console.log("Subject semester:", semester_id);
    console.log("Active semester:", activeSemesterId);
    console.log("Curriculum found:", curriculum_id);

    if (year_level_id !== 1 || semester_id !== activeSemesterId || curriculum_id !== curriculumID) {
      console.log(`Skipping subject ${subject_id} (not Year 1, not active semester ${activeSemesterId}, or wrong curriculum)`);
      return res.status(200).json({ message: "Skipped - Not Year 1 / Not Active Semester / Wrong Curriculum" });
    }

    const checkDuplicateSql = `
      SELECT * FROM enrolled_subject 
      WHERE course_id = ? AND student_number = ? AND active_school_year_id = ?
    `;

    const [dupResult] = await db3.query(checkDuplicateSql, [subject_id, user_id, activeSchoolYearId]);

    if (dupResult.length > 0) {
      console.log(`Skipping subject ${subject_id}, already enrolled for student ${user_id}`);
      return res.status(200).json({ message: "Skipped - Already Enrolled" });
    }

    const insertSql = `
      INSERT INTO enrolled_subject (course_id, student_number, active_school_year_id, curriculum_id, department_section_id) 
      VALUES (?, ?, ?, ?, ?)
    `;

    await db3.query(insertSql, [subject_id, user_id, activeSchoolYearId, curriculumID, departmentSectionID]);
    console.log(`Student ${user_id} successfully enrolled in subject ${subject_id}`);
    res.status(200).json({ message: "Course enrolled successfully" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

//(UPDATED!)
app.post("/add-to-enrolled-courses/:userId/:currId/", async (req, res) => {
  const { subject_id, department_section_id } = req.body;
  const { userId, currId } = req.params;

  try {
    const activeYearSql = `SELECT id FROM active_school_year_table WHERE astatus = 1 LIMIT 1`;
    const [yearResult] = await db3.query(activeYearSql);

    if (yearResult.length === 0) {
      return res.status(404).json({ error: "No active school year found" });
    }

    const activeSchoolYearId = yearResult[0].id;

    const sql = "INSERT INTO enrolled_subject (course_id, student_number, active_school_year_id, curriculum_id, department_section_id) VALUES (?, ?, ?, ?, ?)";
    await db3.query(sql, [subject_id, userId, activeSchoolYearId, currId, department_section_id]);
    res.json({ message: "Course enrolled successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Delete course by subject_id (UPDATED!)
app.delete("/courses/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const sql = "DELETE FROM enrolled_subject WHERE id = ?";
    await db3.query(sql, [id]);
    res.json({ message: "Course unenrolled successfully" });
    
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Delete all courses for user (UPDATED!)
app.delete("/courses/user/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    const activeYearSql = `SELECT id FROM active_school_year_table WHERE astatus = 1 LIMIT 1`;
    const [yearResult] = await db3.query(activeYearSql);

    if (yearResult.length === 0) {
      return res.status(404).json({ error: "No active school year found" });
    }

    const activeSchoolYearId = yearResult[0].id;

    const sql = "DELETE FROM enrolled_subject WHERE student_number = ? AND active_school_year_id = ?";
    await db3.query(sql, [userId, activeSchoolYearId]);
    res.json({ message: "All courses unenrolled successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Login User (UPDATED!)
app.post("/student-tagging", async (req, res) => {
  const { studentNumber } = req.body;

  if (!studentNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const sql = `
    SELECT * FROM student_status_table as ss 
    INNER JOIN curriculum_table as c ON c.curriculum_id = ss.active_curriculum
    INNER JOIN program_table as pt ON c.program_id = pt.program_id
    INNER JOIN student_numbering_table as sn ON sn.student_number = ss.student_number
    INNER JOIN person_table as ptbl ON ptbl.person_id = sn.person_id  
    WHERE ss.student_number = ?`;
    
    const [results] = await db3.query(sql, [studentNumber]);

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid Student Number" });
    } 

    const student = results[0];
    const token = webtoken.sign(
      {
        id: student.student_status_id,
        person_id: student.person_id,
        studentNumber: student.student_number,
        activeCurriculum: student.active_curriculum,
        yearLevel: student.year_level_id,
        courseCode: student.program_code,
        courseDescription: student.program_description,
        firstName: student.first_name,
        middleName: student.middle_name,
        lastName: student.last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Search response:", {
      token,
      studentNumber: student.student_number,
      person_id: student.person_id, 
      activeCurriculum: student.active_curriculum,
      yearLevel: student.year_level_id,
      courseCode: student.program_code,
      courseDescription: student.program_description,
      firstName: student.first_name,
      middleName: student.middle_name,
      lastName: student.last_name,
    });

    res.json({
      message: "Search successful",
      token,
      studentNumber: student.student_number,
      person_id: student.person_id,
      activeCurriculum: student.active_curriculum,
      yearLevel: student.year_level_id,
      courseCode: student.program_code,
      courseDescription: student.program_description,
      firstName: student.first_name,
      middleName: student.middle_name,
      lastName: student.last_name,
    });
  } catch (err) {
    console.error("SQL error:", err);
    return res.status(500).json({ message: "Database error" });
  }
});

let lastSeenId = 0;

// (UPDATED!)
app.get("/check-new", async (req, res) => {
  try {
    const [results] = await db3.query("SELECT * FROM enrolled_subject ORDER BY id DESC LIMIT 1");
    
    if (results.length > 0) {
      const latest = results[0];
      const isNew = latest.id > lastSeenId;
      if (isNew) {
        lastSeenId = latest.id;
      }
      res.json({ newData: isNew, data: latest });
    } else {
      res.json({ newData: false });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// (UPDATED!)
app.get("/api/department-sections", async (req, res) => {
  const { departmentId } = req.query;

  const query = `
    SELECT * 
    FROM dprtmnt_table as dt
    INNER JOIN dprtmnt_curriculum_table as dc ON dc.dprtmnt_id  = dt.dprtmnt_id
    INNER JOIN curriculum_table as c ON c.curriculum_id = dc.curriculum_id
    INNER JOIN dprtmnt_section_table as ds ON ds.curriculum_id = c.curriculum_id
    INNER JOIN program_table as pt ON c.program_id = pt.program_id
    INNER JOIN section_table as st ON st.id = ds.section_id
    WHERE dt.dprtmnt_id = ?
    ORDER BY ds.id
  `;

  try {
    const [results] = await db3.query(query, [departmentId]);
    res.status(200).json(results);
    console.log(results);
  } catch (err) {
    console.error("Error fetching department sections:", err);
    return res.status(500).json({ error: "Database error", details: err.message });
  }
});

// Express route (UPDATED!)
app.get("/departments", async (req, res) => {
  const sql = "SELECT dprtmnt_id, dprtmnt_code FROM dprtmnt_table";

  try {
    const [result] = await db3.query(sql);
    res.json(result);
  } catch (err) {
    console.error("Error fetching departments:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 📌 Count how many students enrolled per subject for a selected section (UPDATED!)
app.get("/subject-enrollment-count", async (req, res) => {
  const { sectionId } = req.query; // department_section_id

  try {
    const activeYearSql = `SELECT id FROM active_school_year_table WHERE astatus = 1 LIMIT 1`;
    const [yearResult] = await db3.query(activeYearSql);

    if (yearResult.length === 0) {
      return res.status(404).json({ error: "No active school year found" });
    }

    const activeSchoolYearId = yearResult[0].id;

    const sql = `
      SELECT 
        es.course_id,
        COUNT(*) AS enrolled_count
      FROM enrolled_subject AS es
      WHERE es.active_school_year_id = ?
        AND es.department_section_id = ?
      GROUP BY es.course_id
    `;

    const [result] = await db3.query(sql, [activeSchoolYearId, sectionId]);
    res.json(result); // [{ course_id: 1, enrolled_count: 25 }, { course_id: 2, enrolled_count: 30 }]
  } catch (err) {
    console.error("Error fetching enrolled counts:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Get user by person_id (UPDATED!)
app.get("/api/user/:person_id", async (req, res) => {
  const { person_id } = req.params;

  try {
    const sql = "SELECT profile_img FROM person_table WHERE person_id = ?";
    const [results] = await db3.query(sql, [person_id]);

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    res.json(results[0]);
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).send("Database error");
  }
});

// REGISTER (CHECK)  (UPDATED!)
app.post("/api/register", async (req, res) => {
  const { first_name, middle_name, last_name } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).send("First name and last name are required");
  }

  try {
    const sql = "INSERT INTO person_table (first_name, middle_name, last_name) VALUES (?, ?, ?)";
    const [result] = await db3.query(sql, [first_name, middle_name, last_name]);
    const person_id = result.insertId;
    res.json({ person_id });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).send("Error registering user");
  }
});

// GET GRADING PERIOD (UPDATED!)
app.get('/get-grading-period', async (req, res) => {
  try{
    const sql = 'SELECT * FROM period_status';
    const [result] = await db3.query(sql);
    

    res.json(result);
  }catch (err){ 
    console.error("Database error:", err);
    return res.status(500).send("Error fetching data")
  }
});

// ACTIVATOR API OF GRADING PERIOD (UPDATED!)
app.post('/grade_period_activate/:id', async (req, res) => {
  const {id} = req.params;

  try{
    const sql1 = 'UPDATE period_status SET status = 0';
    await db3.query(sql1);

    const sql2 = 'UPDATE period_status SET status = 1 WHERE id = ?';
    await db3.query(sql2, [id]);
    
    res.status(200).json({ message: 'Grading period activated successfully' })
  }
  catch(error){
    res.status(500).json({ error: 'Failed to activate grading period' });
  }
})


/* ------------------------------------------- MIDDLE PART OF THE SYSTEM ----------------------------------------------*/

/* ------------------------------------------- UPLOAD  ---------------------------------------------------------- */

// UPOAD PROFILE IMAGE (CHECK) (UPDATED!)
app.post("/api/upload-profile-picture", upload.single("profile_picture"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const { person_id } = req.body;
  if (!person_id) {
    return res.status(400).send("Missing person_id");
  }

  const oldPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const newFilename = `${person_id}_profile_picture${ext}`;
  const newPath = path.join(uploadPath, newFilename);

  try {
    // Rename the uploaded file
    await fs.promises.rename(oldPath, newPath);

    const sql = "UPDATE person_table SET profile_img = ? WHERE person_id = ?";
    await db3.query(sql, [newFilename, person_id]);
    res.send("Profile picture uploaded successfully");
  } catch (err) {
    console.error("Error processing file:", err);
    return res.status(500).send("Error processing profile picture");
  }
});

app.listen(5000, () => {
    console.log('Server runnning');
});