const express = require('express');
const mysql = require('mysql2');
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

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

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

//MYSQL CONNECTION FOR ENROLLMENT
const db2 = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'enrollment',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

//MYSQL CONNECTION FOR ROOM MANAGEMENT AND OTHERS
const db3 = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'earist_sis',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


/*--------------------------------------------------*/ 

//ADMISSION
//REGISTER
app.post("/register", async (req, res) => {
    const {email, password} = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.beginTransaction((err) => {
            if (err) return db.rollback(() => res.status(500).send({ message: "Transaction start failed" })); 
            
            const query1 = 'INSERT INTO person_table () VALUES ()';
            
            db.query(query1, (err, result) => {
                if (err) return db.rollback(() => res.status(500).send({ message: "Error creating person_id" })); 
            
                const person_id = result.insertId;
                
                const query2 = 'INSERT INTO user_accounts (person_id, email, password) VALUES (?, ?, ?)';
 
                db.query(query2, [person_id, email, hashedPassword], (err, result) => {
                    if (err) return db.rollback(() => res.status(500).send({ message: "Error inserting user data" })); 
                
                    db.commit((err) => {
                        if (err) return db.rollback(() => res.status(500).send({ message: "Transaction commit failed" }));
                        res.status(201).send({ message: "Registration successful!", person_id });
                    });
                });
            });
        });
    } 
    catch(error) {
        res.status(500).send({message: "Internal Server Error"});
    }
});

//GET ADMITTED USERS
app.get('/admitted_users', (req, res) => {
    const query = 'SELECT * FROM users_account';

    db.query(query, (err,result) => {
        if (err) return res.status(500).send({message: 'Error Fetching data from the server'});
        res.status(200).send(result);
    });
});

//TRANSFER ENROLLED USER INTO ENROLLMENT
app.post('/transfer', async (req, res) => {
    const { person_id } = req.body;

    const fetchQuery = 'SELECT * FROM users_account WHERE person_id = ?';

    db.query(fetchQuery, [person_id], (err, result) => {
        if (err) return res.status(500).send({ message: "Error fetching data from admission DB", error: err });

        if (result.length === 0) {
            return res.status(404).send({ message: "User not found in admission DB" });
        }

        const user = result[0];
        
        const insertPersonQuery = 'INSERT INTO person_table (first_name, middle_name, last_name) VALUES (?, ?, ?)';

        db2.query(insertPersonQuery, [user.first_name, user.middle_name, user.last_name], (err, personInsertResult) => {
            if (err) {
                console.log("Error inserting person:", err);
                return res.status(500).send({ message: "Error inserting person data", error: err });
            }

            const newPersonId = personInsertResult.insertId;

            const insertUserQuery = 'INSERT INTO user_accounts (person_id, email, password) VALUES (?, ?, ?)';

            db2.query(insertUserQuery, [newPersonId, user.email, user.password], (err, insertResult) => {
                if (err) {
                    console.log("Error inserting user:", user.email, err);
                    return res.status(500).send({ message: "Error inserting user account", error: err });
                } else {
                    console.log("User transferred successfully:", user.email);
                    return res.status(200).send({ message: "User transferred successfully", email: user.email });
                }
            });
        });
    });
});

// ADM FORM PANEL (UPLOAD REQUIREMENTS)
app.post("/upload", upload.single("file"), (req, res) => {
    const { requirementId } = req.body;

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Check if requirementId is provided
    if (!requirementId) {
        return res.status(400).json({ error: "Missing requirementId" });
    }

    const filePath = `/uploads/${req.file.filename}`;

    const sql = "UPDATE admission_requirement SET image_path = ? WHERE requirements_id = ?";
    db.query(sql, [filePath, requirementId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to update record" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Requirement not found" });
        }

        res.status(200).json({ message: "File uploaded successfully", filePath });
    });
});

// GET THE APPLICANT REQUIREMENTS
app.get("/applicant-requirements", (req, res) => {
    const sql = `
      SELECT ar.id, ar.created_at, r.requirements_description AS title 
      FROM applicant_requirements ar
      JOIN requirements r ON ar.student_requirement_id = r.requirements_id
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Error fetching requirements" });
      }
      res.json(results);
    });
});

// DELETE APPLICANT REQUIREMENTS
app.delete("/applicant-requirements/:id", (req, res) => {
    const { id } = req.params;
  
    // First, retrieve the file path
    db.query("SELECT file_path FROM applicant_requirements WHERE id = ?", [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (results.length > 0 && results[0].file_path) {
        const filePath = path.join(__dirname, "uploads", results[0].file_path);
  
        // Delete the file
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
  
      // Delete the record from database
      db.query("DELETE FROM applicant_requirements WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Requirement deleted successfully" });
      });
    });
});

// GET ALL APPLICANTS
app.get("/applicants", (req, res) => {
    const query = "SELECT * FROM applicant_table";
    db.query(query, (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(result);
    });
});

// APPLICANT PANEL FORM
app.post("/applicants", (req, res) => {
    const {
      campus,
      academicProgram,
      classifiedAs,
      program,
      yearLevel,
      lastName,
      firstName,
      middleName,
      extension,
      nickname,
      height,
      weight,
      lrnNumber,
      gender,
      birthOfDate,
      age,
      birthPlace,
      languageDialectSpoken,
      citizenship,
      religion,
      civilStatus,
      tribeEthnicGroup,
      cellphoneNumber,
      emailAddress,
      telephoneNumber,
      facebookAccount,
      presentAddress,
      permanentAddress,
      street,
      barangay,
      zipCode,
      region,
      province,
      municipality,
      dswdHouseholdNumber,
    } = req.body;
  
    const query = `
      INSERT INTO applicant_table (
        campus, academicProgram, classifiedAs, program, yearLevel, lastName, firstName, middleName, extension, nickname,
        height, weight, lrnNumber, gender, birthOfDate, age, birthPlace, languageDialectSpoken, citizenship, religion,
        civilStatus, tribeEthnicGroup, cellphoneNumber, emailAddress, telephoneNumber, facebookAccount, presentAddress, 
        permanentAddress, street, barangay, zipCode, region, province, municipality, dswdHouseholdNumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      query,
      [
        campus, academicProgram, classifiedAs, program, yearLevel, lastName, firstName, middleName, extension, nickname,
        height, weight, lrnNumber, gender, birthOfDate, age, birthPlace, languageDialectSpoken, citizenship, religion,
        civilStatus, tribeEthnicGroup, cellphoneNumber, emailAddress, telephoneNumber, facebookAccount, presentAddress, 
        permanentAddress, street, barangay, zipCode, region, province, municipality, dswdHouseholdNumber
      ],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: "Applicant added", id: result.insertId });
      }
    );
});

// UPDATE APPLICANT INFORMATION
app.put("/applicants/:id", (req, res) => {
    const { id } = req.params;
    const {
      campus,
      academicProgram,
      classifiedAs,
      program,
      yearLevel,
      lastName,
      firstName,
      middleName,
      extension,
      nickname,
      height,
      weight,
      lrnNumber,
      gender,
      birthOfDate,
      age,
      birthPlace,
      languageDialectSpoken,
      citizenship,
      religion,
      civilStatus,
      tribeEthnicGroup,
      cellphoneNumber,
      emailAddress,
      telephoneNumber,
      facebookAccount,
      presentAddress,
      permanentAddress,
      street,
      barangay,
      zipCode,
      region,
      province,
      municipality,
      dswdHouseholdNumber,
    } = req.body;
  
    const query = `
      UPDATE applicant_table SET 
        campus=?, academicProgram=?, classifiedAs=?, program=?, yearLevel=?, lastName=?, firstName=?, middleName=?, 
        extension=?, nickname=?, height=?, weight=?, lrnNumber=?, gender=?, birthOfDate=?, age=?, birthPlace=?, 
        languageDialectSpoken=?, citizenship=?, religion=?, civilStatus=?, tribeEthnicGroup=?, cellphoneNumber=?, 
        emailAddress=?, telephoneNumber=?, facebookAccount=?, presentAddress=?, permanentAddress=?, street=?, 
        barangay=?, zipCode=?, region=?, province=?, municipality=?, dswdHouseholdNumber=?
      WHERE id=?
    `;
  
    db.query(
      query,
      [
        campus, academicProgram, classifiedAs, program, yearLevel, lastName, firstName, middleName, extension, nickname,
        height, weight, lrnNumber, gender, birthOfDate, age, birthPlace, languageDialectSpoken, citizenship, religion,
        civilStatus, tribeEthnicGroup, cellphoneNumber, emailAddress, telephoneNumber, facebookAccount, presentAddress, 
        permanentAddress, street, barangay, zipCode, region, province, municipality, dswdHouseholdNumber, id
      ],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ message: "Applicant updated" });
      }
    );
});

// DELETE APPLICANT 
app.delete("/applicants/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM applicant_table WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: "Applicant deleted" });
    });
});

// GET STUDENT EDUCATIONAL ATTAINMENT
app.get("/educational_attainment", (req, res) => {
    const query = "SELECT * FROM educational_attainment_table";
    db.query(query, (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(result);
    });
});

// EDUCATIONAL ATTAINMENT PANEL FORM
app.post("/educational_attainment", (req, res) => {
    const {
      schoolLevel,
      schoolLastAttended,
      schoolAddress,
      courseProgram,
      honor,
      generalAverage,
      yearGraduated,
      strand,
    } = req.body;
    const query =
      "INSERT INTO educational_attainment_table (schoolLevel, schoolLastAttended, schoolAddress, courseProgram, honor, generalAverage, yearGraduated, strand) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [
        schoolLevel,
        schoolLastAttended,
        schoolAddress,
        courseProgram,
        honor,
        generalAverage,
        yearGraduated,
        strand,
      ],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: "Item created", id: result.insertId });
      }
    );
});

// UPDATE STUDENT'S EDUCATIONAL ATTAINMENT
app.put("/educational_attainment/:id", (req, res) => {
    const {
      schoolLevel,
      schoolLastAttended,
      schoolAddress,
      courseProgram,
      honor,
      generalAverage,
      yearGraduated,
      strand,
    } = req.body;
    const { id } = req.params;
    const query =
      "UPDATE educational_attainment_table SET schoolLevel = ?, schoolLastAttended = ?, schoolAddress = ?, courseProgram = ?, honor = ?, generalAverage = ?, yearGraduated = ?, strand = ? WHERE id = ?";
    db.query(
      query,
      [
        schoolLevel,
        schoolLastAttended,
        schoolAddress,
        courseProgram,
        honor,
        generalAverage,
        yearGraduated,
        strand,
        id,
      ],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ message: "Item updated" });
      }
    );
});

// DELETE STUDENT'S EDUCATIONAL ATTAINMENT
app.delete("/educational_attainment/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM educational_attainment_table WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: "Item deleted" });
    });
});

// GET STUDENT FAMILY BACKGROUND
app.get("/family_background", (req, res) => {
    const query = "SELECT * FROM family_background_table";
    db.query(query, (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(result);
    });
});

// FAMILY BACKGROUND PANEL FORM
app.post("/family_background", (req, res) => {
    const {
      solo_parent,
      father_deceased,
      father_family_name,
      father_given_name,
      father_middle_name,
      father_ext,
      father_nickname,
      father_education_level,
      father_last_school,
      father_course,
      father_year_graduated,
      father_contact,
      father_occupation,
      father_employer,
      father_income,
      father_email,
      mother_deceased,
      mother_family_name,
      mother_given_name,
      mother_middle_name,
      mother_nickname,
      mother_education_level,
      mother_school_address,
      mother_course,
      mother_year_graduated,
      mother_contact,
      mother_occupation,
      mother_employer,
      mother_income,
      mother_email
    } = req.body;
    const query =
      "INSERT INTO family_background_table (solo_parent, father_deceased, father_family_name, father_given_name, father_middle_name, father_ext, father_nickname, father_education_level, father_last_school, father_course, father_year_graduated, father_contact, father_occupation, father_employer, father_income, father_email, mother_deceased, mother_family_name, mother_given_name, mother_middle_name, mother_nickname, mother_education_level, mother_school_address, mother_course, mother_year_graduated, mother_contact, mother_occupation, mother_employer, mother_income, mother_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [
        solo_parent,
        father_deceased,
        father_family_name,
        father_given_name,
        father_middle_name,
        father_ext,
        father_nickname,
        father_education_level,
        father_last_school,
        father_course,
        father_year_graduated,
        father_contact,
        father_occupation,
        father_employer,
        father_income,
        father_email,
        mother_deceased,
        mother_family_name,
        mother_given_name,
        mother_middle_name,
        mother_nickname,
        mother_education_level,
        mother_school_address,
        mother_course,
        mother_year_graduated,
        mother_contact,
        mother_occupation,
        mother_employer,
        mother_income,
        mother_email
      ],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: "Item created", id: result.insertId });
      }
    );
});

// UPDATE STUDENT FAMILY BACKGROUND
app.put("/family_background/:id", (req, res) => {
    const {
      solo_parent,
      father_deceased,
      father_family_name,
      father_given_name,
      father_middle_name,
      father_ext,
      father_nickname,
      father_education_level,
      father_last_school,
      father_course,
      father_year_graduated,
      father_contact,
      father_occupation,
      father_employer,
      father_income,
      father_email,
      mother_deceased,
      mother_family_name,
      mother_given_name,
      mother_middle_name,
      mother_nickname,
      mother_education_level,
      mother_school_address,
      mother_course,
      mother_year_graduated,
      mother_contact,
      mother_occupation,
      mother_employer,
      mother_income,
      mother_email
    } = req.body;
    const { id } = req.params;
    const query =
      "UPDATE family_background_table SET solo_parent = ?, father_deceased = ?, father_family_name = ?, father_given_name = ?, father_middle_name = ?, father_ext = ?, father_nickname = ?, father_education_level = ?, father_last_school = ?, father_course = ?, father_year_graduated = ?, father_contact = ?, father_occupation = ?, father_employer = ?, father_income = ?, father_email = ?, mother_deceased = ?, mother_family_name = ?, mother_given_name = ?, mother_middle_name = ?, mother_nickname = ?, mother_education_level = ?, mother_school_address = ?, mother_course = ?, mother_year_graduated = ?, mother_contact = ?, mother_occupation = ?, mother_employer = ?, mother_income = ?, mother_email = ? WHERE id = ?";
    db.query(
      query,
      [
        solo_parent,
        father_deceased,
        father_family_name,
        father_given_name,
        father_middle_name,
        father_ext,
        father_nickname,
        father_education_level,
        father_last_school,
        father_course,
        father_year_graduated,
        father_contact,
        father_occupation,
        father_employer,
        father_income,
        father_email,
        mother_deceased,
        mother_family_name,
        mother_given_name,
        mother_middle_name,
        mother_nickname,
        mother_education_level,
        mother_school_address,
        mother_course,
        mother_year_graduated,
        mother_contact,
        mother_occupation,
        mother_employer,
        mother_income,
        mother_email,
        id
      ],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ message: "Item updated" });
      }
    );
});

// DELETE STUDENT FAMILY BACKGROUND
app.delete("/family_background/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM family_background_table WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: "Item deleted" });
    });
});

// GET STUDENT PROFILE INFORMATION
app.get('/student_profile_table', (req, res) => {
    const query = 'SELECT * FROM student_profile_table';
    db.query(query, (err, result) => {
        if (err) return res.status(500).send({ message: 'Internal Server Error' });
        res.status(200).send(result);
    });
});

// STUDENT PROFILE INFORMATION PANEL
app.post('/student_profile_table', (req, res) => {
    const {
        branch, student_number, LRN, last_name, first_name, middle_name, middle_initial, extension,
        mobile_number, residential_address, residential_region, residential_province, residential_municipality,
        residential_telephone, permanent_address, permanent_region, permanent_province, permanent_municipality,
        permanent_telephone, monthly_income, ethnic_group, pwd_type, date_of_birth, place_of_birth,
        gender, religion, citizenship, civil_status, blood_type, nstp_serial_number, transfer_status,
        previous_school, transfer_date, school_year, term, transfer_reason, department, program,
        year_level, section, curriculum_type, curriculum_year, admission_year, assessment_type,
        admission_status, enrollment_status, academic_status
    } = req.body;
  
    const query = `INSERT INTO student_profile_table (
        branch, student_number, LRN, last_name, first_name, middle_name, middle_initial, extension,
        mobile_number, residential_address, residential_region, residential_province, residential_municipality,
        residential_telephone, permanent_address, permanent_region, permanent_province, permanent_municipality,
        permanent_telephone, monthly_income, ethnic_group, pwd_type, date_of_birth, place_of_birth,
        gender, religion, citizenship, civil_status, blood_type, nstp_serial_number, transfer_status,
        previous_school, transfer_date, school_year, term, transfer_reason, department, program,
        year_level, section, curriculum_type, curriculum_year, admission_year, assessment_type,
        admission_status, enrollment_status, academic_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(query, [
        branch, student_number, LRN, last_name, first_name, middle_name, middle_initial, extension,
        mobile_number, residential_address, residential_region, residential_province, residential_municipality,
        residential_telephone, permanent_address, permanent_region, permanent_province, permanent_municipality,
        permanent_telephone, monthly_income, ethnic_group, pwd_type, date_of_birth, place_of_birth,
        gender, religion, citizenship, civil_status, blood_type, nstp_serial_number, transfer_status,
        previous_school, transfer_date, school_year, term, transfer_reason, department, program,
        year_level, section, curriculum_type, curriculum_year, admission_year, assessment_type,
        admission_status, enrollment_status, academic_status
    ], (err, result) => {
        if (err) return res.status(500).send({ message: 'Internal Server Error' });
        res.status(201).send({ message: 'Student profile created', id: result.insertId });
    });
});

// UPDATE STUDENT PROFILE INFORMATION
app.put('/student_profile_table/:id', (req, res) => {
    const {
        branch, student_number, LRN, last_name, first_name, middle_name, middle_initial, extension,
        mobile_number, residential_address, residential_region, residential_province, residential_municipality,
        residential_telephone, permanent_address, permanent_region, permanent_province, permanent_municipality,
        permanent_telephone, monthly_income, ethnic_group, pwd_type, date_of_birth, place_of_birth,
        gender, religion, citizenship, civil_status, blood_type, nstp_serial_number, transfer_status,
        previous_school, transfer_date, school_year, term, transfer_reason, department, program,
        year_level, section, curriculum_type, curriculum_year, admission_year, assessment_type,
        admission_status, enrollment_status, academic_status
    } = req.body;
  
    const { id } = req.params;
    const query = `
        UPDATE student_profile_table SET
            branch = ?, student_number = ?, LRN = ?, last_name = ?, first_name = ?, middle_name = ?, middle_initial = ?, extension = ?,
            mobile_number = ?, residential_address = ?, residential_region = ?, residential_province = ?, residential_municipality = ?,
            residential_telephone = ?, permanent_address = ?, permanent_region = ?, permanent_province = ?, permanent_municipality = ?,
            permanent_telephone = ?, monthly_income = ?, ethnic_group = ?, pwd_type = ?, date_of_birth = ?, place_of_birth = ?,
            gender = ?, religion = ?, citizenship = ?, civil_status = ?, blood_type = ?, nstp_serial_number = ?, transfer_status = ?,
            previous_school = ?, transfer_date = ?, school_year = ?, term = ?, transfer_reason = ?, department = ?, program = ?,
            year_level = ?, section = ?, curriculum_type = ?, curriculum_year = ?, admission_year = ?, assessment_type = ?,
            admission_status = ?, enrollment_status = ?, academic_status = ?
        WHERE id = ?`;
  
    db.query(query, [
        branch, student_number, LRN, last_name, first_name, middle_name, middle_initial, extension,
        mobile_number, residential_address, residential_region, residential_province, residential_municipality,
        residential_telephone, permanent_address, permanent_region, permanent_province, permanent_municipality,
        permanent_telephone, monthly_income, ethnic_group, pwd_type, date_of_birth, place_of_birth,
        gender, religion, citizenship, civil_status, blood_type, nstp_serial_number, transfer_status,
        previous_school, transfer_date, school_year, term, transfer_reason, department, program,
        year_level, section, curriculum_type, curriculum_year, admission_year, assessment_type,
        admission_status, enrollment_status, academic_status,
        id
    ], (err, result) => {
        if (err) return res.status(500).send({ message: 'Internal Server Error' });
        res.status(200).send({ message: 'Student profile updated' });
    });
});

// DELETE STUDENT PROFILE INFORMATION
app.delete('/student_profile_table/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM student_profile_table WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send({ message: 'Internal Server Error' });
        res.status(200).send({ message: 'Student profile deleted' });
    });
});

/*---------------------------  ENROLLMENT -----------------------*/ 

// LOGIN PANEL
app.post("/login", (req, res) => {
    const {email, password} = req.body;

    const query = 'SELECT * FROM users_account WHERE email = ?';

    db.query(query, [email], async (err, result) => {
        if (err) return res.status(500).send(err);

        if (result.length === 0) return res.status(400).send({message: 'Users not found...'});

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(400).send({message: 'Invalid Credentials'});

        const token = webtoken.sign({
            id: user.id,
            person_id: user.person_id,
            email: user.email,
        },
            'secret', { expiresIn: '1h'}
        );
        res.status(200).send({token, user: {person_id: user.person_id, email: user.email}});
    }); 
});

//READ ENROLLED USERS 
app.get('/enrolled_users', (req, res) => {
    const query = 'SELECT * FROM user_accounts';

    db2.query(query, (err,result) => {
        if (err) return res.status(500).send({message: 'Error Fetching data from the server'});
        res.status(200).send(result);
    });
});

// DEPARTMENT CREATION
app.post('/department', (req, res) => {
    const { dep_name, dep_code } = req.body;
    const query = 'INSERT INTO dprtmnt_table (dprtmnt_name, dprtmnt_code) VALUES (?, ?)';
    db3.query(query, [dep_name, dep_code], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ insertId: result.insertId });
    });
});

// DEPARTMENT LIST
app.get('/get_department', (req, res) => {
    const getQuery = 'SELECT * FROM dprtmnt_table';

    db3.query(getQuery, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

// UPDATE DEPARTMENT INFORMATION (SUPERADMIN)
app.put('/update_department/id', (req, res) => {
    const {id, dep_name, dep_code} = req.body;
    const updateQuery = 'UPDATE '

    db3.query(updateQuery, [id, dep_name, dep_code], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result); 
    })
})

// DELETE DEPARTMENT (SUPERADMIN)
app.delete('/delete_department/id', (req, res) => {
    const {id} = req.query;
    const deleteQuery = 'DELETE'
    db3.query(deleteQuery, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result); 
    })
})

// PROGRAM CREATION
app.post('/program', (req, res) => { 
    const { name, code } = req.body;

    const insertProgramQuery = 'INSERT INTO program_table (program_description, program_code) VALUES (?, ?)';

    db3.query(insertProgramQuery, [name, code], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

// PROGRAM TABLE
app.get('/get_program', (req, res) => {
    const programQuery = 'SELECT * FROM program_table';
    db3.query(programQuery, (err, result) => {
     if (err) return res.status(500).send(err);
     res.status(200).send(result);
    })
});

// UPDATE PROGRAM INFORMATION (SUPERADMIN)
app.put('/update_program/id', (req, res) => {
    const {id, name, code} = req.body;
    const updateQuery = 'UPDATE '

    db3.query(updateQuery, [id, name, code], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result); 
    })
})

// DELETE PROGRAM (SUPERADMIN)
app.delete('/delete_program/id', (req, res) => {
    const {id} = req.query;

    const deleteQuery = 'DELETE'
    db3.query(deleteQuery, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result); 
    })
})

// CURRICULUM CREATION
app.post('/curriculum', (req, res) => {
    const {year_id, program_id} = req.body;

    const insertQuery = 'INSERT INTO curriculum_table(year_id, program_id) VALUES (?,?)';

    db3.query(insertQuery, [year_id, program_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result); 
    })
})

// CURRICULUM LIST
app.get('/get_curriculum', (req, res) => {
    const readQuery = `
        SELECT ct.*, p.*, y.* 
        FROM curriculum_table ct 
        INNER JOIN program_table p ON ct.program_id = p.program_id
        INNER JOIN year_table y ON ct.year_id = y.year_id
    `;

    db3.query(readQuery, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result); 
    });
});

// UPDATE CURRICULUM (SUPERADMIN)

// DELETE CURRICULUM (SUPERADMIN)

// COURSE TABLE
app.post('/adding_course', (req, res) => {
    const {course_code, course_description, course_unit, lab_unit} = req.body;

    const courseQuery = 'INSERT INTO course_table(course_code, course_description, course_unit, lab_unit) VALUES (?,?,?,?)';
    db3.query(courseQuery, [course_code, course_description, course_unit, lab_unit], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

// READ COURSE
app.get('/courselist', (req, res) => {
    const readQuery = 'SELECT * FROM program_tagging_table as ptt INNER JOIN course_table as ct ON ptt.course_id = ct.course_id ';
    db3.query(readQuery, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

// UPDATE COURSE (SUPERADMIN)

// DELETE COURSE (SUPERADMIN)

// GET COURSES BY CURRICULUM ID
app.get('/get_courses_by_curriculum/:curriculum_id', (req, res) => {
    const { curriculum_id } = req.params;
    
    const query = `
        SELECT c.* FROM program_tagging_table pt
        INNER JOIN course_table c ON pt.course_id = c.course_id
        WHERE pt.curriculum_id = ?
    `;

    db3.query(query, [curriculum_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

// COURSE TAGGING LIST
app.get('/get_course', (req, res) => {
    const getCourseQuery = `
        SELECT 
            yl.*, st.*, c.*
        FROM program_tagging_table pt
        INNER JOIN year_level_table yl ON pt.year_level_id = yl.year_level_id
        INNER JOIN semester_table st ON pt.semester_id = st.semester_id
        INNER JOIN course_table c ON pt.course_id = c.course_id
    `;

    db3.query(getCourseQuery, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.status(200).send(results);
    });
});

// PROGRAM TAGGING TABLE
app.post('/program_tagging', (req, res) => {
    const {curriculum_id, year_level_id, semester_id, course_id} = req.body;

    const progTagQuery = 'INSERT INTO program_tagging_table (curriculum_id, year_level_id, semester_id, course_id) VALUES (?,?,?,?)';
    db3.query(progTagQuery, [curriculum_id, year_level_id, semester_id, course_id], (err,result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

// YEAR TABLE
app.post("/years", (req, res) => {
    const { year_description } = req.body;
    if (!year_description) {
        return res.status(400).json({ error: "year_description is required" });
    }
  
    const query = "INSERT INTO year_table (year_description, status) VALUES (?, 0)";
    db3.query(query, [year_description], (err, result) => {
        if (err) {
            console.error("Insert error:", err);
            return res.status(500).json({ error: "Insert failed" });
        }
        res.status(201).json({ year_id: result.insertId, year_description, status: 0 });
    });
});

// YEAR LIST
app.get("/year_table", (req, res) => {
    const query = "SELECT * FROM year_table";
    db3.query(query, (err, result) => {
        if (err) {
          console.error("Query error:", err);
          return res.status(500).json({ error: "Query failed" });
        }
        res.status(200).json(result);
    });
});

// UPDATE YEAR PANEL INFORMATION
app.put('/year_table/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
  
    if (status === 1) {
      // First deactivate all other years
      const deactivateQuery = "UPDATE year_table SET status = 0";
      db3.query(deactivateQuery, (deactivateErr) => {
        if (deactivateErr) {
          console.error("Deactivation error:", deactivateErr);
          return res.status(500).json({ error: "Failed to deactivate all years" });
        }
  
        // Activate the selected year
        const activateQuery = "UPDATE year_table SET status = 1 WHERE year_id = ?";
        db3.query(activateQuery, [id], (activateErr) => {
          if (activateErr) {
            console.error("Activation error:", activateErr);
            return res.status(500).json({ error: "Failed to activate the selected year" });
          }
  
          res.status(200).json({ message: "Year status updated successfully" });
        });
      });
    } else {
      // Just deactivate the selected year
      const updateQuery = "UPDATE year_table SET status = 0 WHERE year_id = ?";
      db3.query(updateQuery, [id], (err) => {
        if (err) {
          console.error("Deactivation error:", err);
          return res.status(500).json({ error: "Failed to deactivate the selected year" });
        }
  
        res.status(200).json({ message: "Year deactivated successfully" });
      });
    }
});

// YEAR LEVEL PANEL
app.post("/years_level", (req, res) => {
    const { year_level_description } = req.body;
    if (!year_level_description) {
        return res.status(400).json({ error: "year_level_description is required" });
    }
  
    const query = "INSERT INTO year_level_table (year_level_description) VALUES (?)";
    db3.query(query, [year_level_description], (err, result) => {
        if (err) {
            console.error("Insert error:", err);
            return res.status(500).json({ error: "Insert failed" });
        }
        res.status(201).json({
            year_level_id: result.insertId,
            year_level_description,
        });
    });
});
  

// YEAR LEVEL TABLE
app.get('/get_year_level', (req, res) => {
    const query = 'SELECT * FROM year_level_table';
    db3.query(query, (err,result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

// SEMESTER PANEL
app.post("/semesters", (req, res) => {
    const { semester_description } = req.body;
    if (!semester_description) {
        return res.status(400).json({ error: "semester_description is required" });
    }
  
    const query = "INSERT INTO semester_table (semester_description) VALUES (?)";
    db3.query(query, [semester_description], (err, result) => {
        if (err) {
            console.error("Insert error:", err);
            return res.status(500).json({ error: "Insert failed" });
        }
        res.status(201).json({
            semester_id: result.insertId,
            semester_description,
        });
    });
});

// SEMESTER TABLE
app.get('/get_semester', (req, res) => {
    const query = 'SELECT * FROM semester_table';
    db3.query(query, (err,result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

// GET SCHOOL YEAR
app.get("/school_years", (req, res) => {
    const query = `
      SELECT sy.*, yt.year_description, s.semester_description
      FROM active_school_year_table sy
      JOIN year_table yt ON sy.year_id = yt.year_id
      JOIN semester_table s ON sy.semester_id = s.semester_id
    `;
    db3.query(query, (err, result) => {
      if (err) {
        console.error("Fetch error:", err);
        return res.status(500).json({ error: "Failed to fetch school years" });
      }
      res.json(result);
    });
  });

// SCHOOL YEAR PANEL
app.post("/school_years", (req, res) => {
    const { year_id, semester_id, activator } = req.body;
  
    if (!year_id || !semester_id) {
      return res.status(400).json({ error: "Missing fields" });
    }
  
    const insertSchoolYear = () => {
      const insertQuery = `
        INSERT INTO active_school_year_table (year_id, semester_id, astatus, active)
        VALUES (?, ?, ?, 0)
      `;

      db3.query(insertQuery, [year_id, semester_id, activator, 0], (err, result) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ error: "Insert failed" });
        }
        res.status(201).json({ school_year_id: result.insertId });
      });
    };
  
    // If activating a school year, deactivate all others first
    if (activator === 1) {
      const deactivateQuery = `UPDATE active_school_year_table SET astatus = 0`;
      db3.query(deactivateQuery, (err) => {
        if (err) {
          console.error("Deactivation error:", err);
          return res.status(500).json({ error: "Deactivation failed" });
        }
        insertSchoolYear(); // Proceed to insert after deactivation
      });
    } else {
      insertSchoolYear(); // No need to deactivate others if inserting as inactive
    }
});

// UPDATE SCHOOL YEAR INFORMATION
app.put("/school_years/:id", (req, res) => {
    const { id } = req.params;
    const { activator } = req.body;

    if (parseInt(activator) === 1) {
      // First deactivate all, then activate the selected one
      const deactivateAllQuery = "UPDATE active_school_year_table SET astatus = 0";
      
      db3.query(deactivateAllQuery, (err) => {
        if (err) {
          console.error("Deactivation error:", err);
          return res.status(500).json({ error: "Failed to deactivate all school years" });
        }
  
        const activateQuery = "UPDATE active_school_year_table SET astatus = 1 WHERE id = ?";
        db3.query(activateQuery, [id], (err) => {
          if (err) {
            console.error("Activation error:", err);
            return res.status(500).json({ error: "Failed to activate school year" });
          }
          return res.status(200).json({ message: "School year activated and others deactivated" });
        });
      });
    } else {
      // Just deactivate the selected one
      const query = "UPDATE active_school_year_table SET astatus = 0 WHERE id = ?";
      db3.query(query, [id], (err) => {
        if (err) {
          console.error("Deactivation error:", err);
          return res.status(500).json({ error: "Failed to deactivate school year" });
        }
        return res.status(200).json({ message: "School year deactivated" });
      });
    }
});
  
// ROOM CREATION
app.post('/room', (req, res) => {
    const { room_name, department_id } = req.body;

    if(department_id === ''){
        return console.log("No department id received");
    };

    const insertRoomQuery = 'INSERT INTO room_table (room_description) VALUES (?)';
    db3.query(insertRoomQuery, [room_name], (err, roomResult) => {
        if (err) return res.status(500).send(err);

        const room_id = roomResult.insertId;

        const linkRoomQuery = 'INSERT INTO dprtmnt_room_table (dprtmnt_id, room_id, lock_status) VALUES (?, ?, 0)';
        db3.query(linkRoomQuery, [department_id, room_id], (err, linkResult) => {
            if (err) return res.status(500).send(err);

            res.status(200).send({ roomId: room_id, linkId: linkResult.insertId });
        });
    });
});

// ROOM LIST
app.get('/get_room', (req, res) => {
    const { department_id } = req.query;

    const getRoomQuery = `
        SELECT r.room_id, r.room_description, d.dprtmnt_name
        FROM room_table r
        INNER JOIN dprtmnt_room_table drt ON r.room_id = drt.room_id
        INNER JOIN dprtmnt_table d ON drt.dprtmnt_id = d.dprtmnt_id
        WHERE drt.dprtmnt_id = ? 
    `;
    
    db3.query(getRoomQuery, [department_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

// UPDATE ROOM (SUPERADMIN)

// DELETE ROOM (SUPERADMIN)

// SECTIONS
app.post('/section_table', (req, res) => {
    const { description } = req.body;
    if (!description) {
      return res.status(400).send('Description is required');
    }
  
    const query = 'INSERT INTO section_table (description) VALUES (?)';
    db3.query(query, [description], (err, result) => {
      if (err) {
        console.error('Error inserting section:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.status(201).send(result);
    });
});

// SECTIONS LIST
app.get('/section_table', (req, res) => {
    const query = 'SELECT * FROM section_table';
    db3.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching sections:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.status(200).send(result);
    });
});

// UPDATE SECTIONS (SUPERADMIN)

// DELETE SECTIONS (SUPERADMIN)

// DEPARTMENT SECTIONS
app.post('/department_section', (req, res) => {
    const { curriculum_id, section_id } = req.body;

    const query = 'INSERT INTO dprtmnt_section_table (curriculum_id, section_id, dsstat) VALUES (?,?,0)';
    db3.query(query, [curriculum_id, section_id, 0], (err, result) => {
      if (err) {
        console.error('Error inserting section:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.status(201).send(result);
    });
});

// PROFFESOR REGISTRATION
app.post('/register_prof', async (req, res) => {
    const {fname, mname, lname, email, password} = req.body;

    const hashedProfPassword = await bcrypt.hash(password, 10);
    
    const queryForProf = 'INSERT INTO prof_table (fname, mname, lname, email, password, status) VALUES (?,?,?,?,?,?)';
    
    db3.query(queryForProf, [fname, mname, lname, email, hashedProfPassword, 0], (err, result)=>{
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

app.post("/login_prof", (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    const sql = `SELECT prof_table.*, time_table.*
    FROM prof_table
    INNER JOIN time_table ON prof_table.prof_id = time_table.professor_id
    WHERE prof_table.email = ?`;
    db3.query(sql, [email], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
  
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
  
      const token = webtoken.sign(
        { prof_id: user.prof_id, fname: user.fname, mname: user.mname, lname: user.lname, email: user.email, school_year_id: user.school_year_id},  // role is included in the token
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // Log to confirm that role is included in the response
      console.log("Login response:", { token, prof_id: user.prof_id, email: user.email, });
  
      const mappings = results.map(row => ({
        department_section_id: row.department_section_id,
        subject_id: row.subject_id
      }));

      res.json({
        message: "Login successful",
        token,
        prof_id: user.prof_id,
        fname: user.fname, 
        mname: user.mname, 
        lname: user.lname, 
        email: user.email,
        subject_section_mappings: mappings,
        school_year_id: user.school_year_id
      });
    });
});

app.get('/get_enrolled_students/:subject_id/:department_section_id/:active_school_year_id', (req, res) => {
    const { subject_id, department_section_id, active_school_year_id } = req.params;

    const filterStudents = `
      SELECT person_table.*, enrolled_subject.*, time_table.*
        FROM time_table
        INNER JOIN enrolled_subject
            ON time_table.subject_id = enrolled_subject.subject_id
            AND time_table.department_section_id = enrolled_subject.department_section_id
            AND time_table.school_year_id = enrolled_subject.active_school_year_id
        INNER JOIN student_numbering
            ON enrolled_subject.student_number = student_numbering.student_number
        INNER JOIN person_table
            ON student_numbering.person_id = person_table.person_id
        WHERE time_table.subject_id = ? 
            AND time_table.department_section_id = ? 
            AND time_table.school_year_id = ?
    `;
  
    db3.query(filterStudents, [subject_id, department_section_id, active_school_year_id], (err, result) => {
      if (err) {
        console.error("Query failed:", err);
        return res.status(500).json({ message: "Server error while fetching students." });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No students found for this subject-section combo." });
      }
  
      res.json(result);
    });
});

// UPDATE ENROLLED STUDENT'S GRADES
app.put('/add_grades', (req, res) => {
    const { midterm, finals, final_grade, en_remarks, student_number, subject_id} = req.body;
    console.log('Received data:', { midterm, finals, final_grade, en_remarks, student_number, subject_id });
  
    const sql = `
      UPDATE enrolled_subject 
      SET midterm = ?, finals = ?, final_grade = ?, en_remarks = ?
      WHERE student_number = ? AND subject_id = ?
    `;
  
    db3.query(sql, [midterm, finals, final_grade, en_remarks, student_number, subject_id], (err, result) => {
      if (err) {
        console.error("Failed to update grades:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(200).json({ message: "Grades updated successfully!" });
    });
});

// PROFESSOR LIST
app.get('/get_prof', (req, res) => {
    const {department_id} = req.query;

    const getProfQuery = `
    SELECT p.*, d.dprtmnt_name
    FROM prof_table p
    INNER JOIN dprtmnt_profs_table dpt ON p.prof_id = dpt.prof_id
    INNER JOIN dprtmnt_table d ON dpt.dprtmnt_id = d.dprtmnt_id
    WHERE dpt.dprtmnt_id = ?
    `;

    db3.query(getProfQuery, [department_id], (err,result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    });
});

// REQUIREMENTS PANEL
app.post("/requirements", (req, res) => {
    const { requirements_description } = req.body;
    if (!requirements_description) {
      return res.status(400).json({ error: "Description required" });
    }
  
    const query = "INSERT INTO requirements (requirements_description) VALUES (?)";
    db.query(query, [requirements_description], (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ error: "Failed to save requirement" });
      }
      res.status(201).json({ requirements_id: result.insertId });
    });
});

// GET THE REQUIREMENTS
app.get("/requirements", (req, res) => {
    const query = "SELECT * FROM requirements ORDER BY requirements_id DESC";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Fetch error:", err);
        return res.status(500).json({ error: "Failed to fetch requirements" });
      }
      res.json(results);
    });
});

/* ------------------------------------------- MIDDLE PART OF THE SYSTEM ----------------------------------------------*/

app.listen(5000, () => {
    console.log('Server runnning');
});