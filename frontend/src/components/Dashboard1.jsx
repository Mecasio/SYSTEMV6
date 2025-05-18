import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Box, TextField, Container, Typography, FormControl, InputLabel, Select, MenuItem, ListSubheader, Modal } from "@mui/material";

const Dashboard1 = () => {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [person, setPerson] = useState({
    profile_picture: "", campus: "", academicProgram: "", classifiedAs: "", program: "", program2: "", program3: "", yearLevel: "", last_name: "", first_name: "",
    middle_name: "", extension: "", nickname: "", height: "", weight: "", lrnNumber: "", gender: "", pwdType: "", pwdId: "", birthOfDate: "",
    age: "", birthPlace: "", languageDialectSpoken: "", citizenship: "", religion: "", civilStatus: "", tribeEthnicGroup: "", cellphoneNumber: "", emailAddress: "", telephoneNumber: "",
    facebookAccount: "", presentStreet: "", presentBarangay: "", presentZipCode: "", presentRegion: "", presentProvince: "", presentMunicipality: "", presentDswdHouseholdNumber: "", permanentStreet: "", permanentBarangay: "",
    permanentZipCode: "", permanentRegion: "", permanentProvince: "", permanentMunicipality: "", permanentDswdHouseholdNumber: "", solo_parent: "", father_deceased: "", father_family_name: "", father_given_name: "", father_middle_name: "",
    father_ext: "", father_nickname: "", father_education_level: "", father_last_school: "", father_course: "", father_year_graduated: "", father_school_address: "", father_contact: "", father_occupation: "", father_employer: "",
    father_income: "", father_email: "", mother_deceased: "", mother_family_name: "", mother_given_name: "", mother_middle_name: "", mother_nickname: "", mother_education_level: "", mother_last_school: "", mother_course: "",
    mother_year_graduated: "", mother_school_address: "", mother_contact: "", mother_occupation: "", mother_employer: "", mother_income: "", mother_email: "", guardian: "", guardian_family_name: "", guardian_given_name: "",
    guardian_middle_name: "", guardian_ext: "", guardian_nickname: "", guardian_address: "", guardian_contact: "", guardian_email: "", annual_income: "", schoolLevel: "", schoolLastAttended: "", schoolAddress: "",
    courseProgram: "", honor: "", generalAverage: "", yearGraduated: "", strand: "", cough: "", colds: "", fever: "", asthma: "", fainting: "",
    heartDisease: "", tuberculosis: "", frequentHeadaches: "", hernia: "", chronicCough: "", headNeckInjury: "", hiv: "", highBloodPressure: "", diabetesMellitus: "", allergies: "",
    cancer: "", smoking: "", alcoholDrinking: "", hospitalized: "", hospitalizationDetails: "", medications: "", hadCovid: "", covidDate: "", vaccine1Brand: "", vaccine1Date: "",
    vaccine2Brand: "", vaccine2Date: "", booster1Brand: "", booster1Date: "", booster2Brand: "", booster2Date: "", chestXray: "", cbc: "", urinalysis: "", otherworkups: "",
    symptomsToday: "", remarks: "", termsOfAgreement: false
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");


  // dot not alter
  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole !== "applicant") {
        window.location.href = "/login";
      } else {
        fetchPersonData(storedID);
      }
    } else {
      window.location.href = "/login";
    }
  }, []);
  // dot not alter
  const fetchPersonData = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/person/${id}`);
      setPerson(res.data);
      setLoading(false);
    } catch (error) {
      setMessage("Error fetching person data.");
      setLoading(false);
    }
  };
  // dot not alter
  const handleChange = (e) => {
  const { name, type, checked, value } = e.target;
  setPerson((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
  }));
};

  // dot not alter
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/person/${userID}`, person);
      setMessage("Information updated successfully.");
    } catch (error) {
      setMessage("Failed to update information.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }
  // dot not alter
  return (
        <Box sx={{ height: "calc(100vh - 120px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent" }}>
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Update Your Information</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Profile Picture</label>
        <input type="text" name="profile_picture" value={person.profile_picture || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a dropdown with options Manila (0) and Cavite (1) */}

      <div className="mb-4"> 
        <label className="block mb-1 font-medium">Campus</label> <select name="campus" value={person.campus ?? "0"} onChange={handleChange} className="w-full border px-3 py-2 rounded"> 
          <option value="0">Manila</option> <option value="1">Cavite</option> </select> 
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Academic Program</label>
        <input type="text" name="academicProgram" value={person.academicProgram || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Classified As</label>
        <input type="text" name="classifiedAs" value={person.classifiedAs || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Program</label>
        <input type="text" name="program" value={person.program || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Program 2</label>
        <input type="text" name="program2" value={person.program2 || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Program 3</label>
        <input type="text" name="program3" value={person.program3 || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Year Level</label>
        <input type="text" name="yearLevel" value={person.yearLevel || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Last Name</label>
        <input type="text" name="last_name" value={person.last_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">First Name</label>
        <input type="text" name="first_name" value={person.first_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Middle Name</label>
        <input type="text" name="middle_name" value={person.middle_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Extension</label>
        <input type="text" name="extension" value={person.extension || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Nickname</label>
        <input type="text" name="nickname" value={person.nickname || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Height</label>
        <input type="text" name="height" value={person.height || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Weight</label>
        <input type="text" name="weight" value={person.weight || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">LRN Number</label>
        <input type="text" name="lrnNumber" value={person.lrnNumber || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Gender</label>
        <input type="text" name="gender" value={person.gender || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">PWD Type</label>
        <input type="text" name="pwdType" value={person.pwdType || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">PWD ID</label>
        <input type="text" name="pwdId" value={person.pwdId || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Birth of Date</label>
        <input type="text" name="birthOfDate" value={person.birthOfDate || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Age</label>
        <input type="text" name="age" value={person.age || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Birth Place</label>
        <input type="text" name="birthPlace" value={person.birthPlace || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Language/Dialect Spoken</label>
        <input type="text" name="languageDialectSpoken" value={person.languageDialectSpoken || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Citizenship</label>
        <input type="text" name="citizenship" value={person.citizenship || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Religion</label>
        <input type="text" name="religion" value={person.religion || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Civil Status</label>
        <input type="text" name="civilStatus" value={person.civilStatus || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Tribe/Ethnic Group</label>
        <input type="text" name="tribeEthnicGroup" value={person.tribeEthnicGroup || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Other Ethnic Group</label>
        <input type="text" name="otherEthnicGroup" value={person.otherEthnicGroup || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Cellphone Number</label>
        <input type="text" name="cellphoneNumber" value={person.cellphoneNumber || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email Address</label>
        <input type="text" name="emailAddress" value={person.emailAddress || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Telephone Number</label>
        <input type="text" name="telephoneNumber" value={person.telephoneNumber || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Facebook Account</label>
        <input type="text" name="facebookAccount" value={person.facebookAccount || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Present Street</label>
        <input type="text" name="presentStreet" value={person.presentStreet || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Present Barangay</label>
        <input type="text" name="presentBarangay" value={person.presentBarangay || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Present Zip Code</label>
        <input type="text" name="presentZipCode" value={person.presentZipCode || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Present Region</label>
        <input type="text" name="presentRegion" value={person.presentRegion || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Present Province</label>
        <input type="text" name="presentProvince" value={person.presentProvince || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Present Municipality</label>
        <input type="text" name="presentMunicipality" value={person.presentMunicipality || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Present DSWD Household Number</label>
        <input type="text" name="presentDswdHouseholdNumber" value={person.presentDswdHouseholdNumber || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Permanent Street</label>
        <input type="text" name="permanentStreet" value={person.permanentStreet || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Permanent Barangay</label>
        <input type="text" name="permanentBarangay" value={person.permanentBarangay || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Permanent Zip Code</label>
        <input type="text" name="permanentZipCode" value={person.permanentZipCode || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Permanent Region</label>
        <input type="text" name="permanentRegion" value={person.permanentRegion || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Permanent Province</label>
        <input type="text" name="permanentProvince" value={person.permanentProvince || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Permanent Municipality</label>
        <input type="text" name="permanentMunicipality" value={person.permanentMunicipality || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Permanent DSWD Household Number</label>
        <input type="text" name="permanentDswdHouseholdNumber" value={person.permanentDswdHouseholdNumber || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Solo Parent</label>
        <input type="text" name="solo_parent" value={person.solo_parent || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Deceased</label>
        <input type="text" name="father_deceased" value={person.father_deceased || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Family Name</label>
        <input type="text" name="father_family_name" value={person.father_family_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Given Name</label>
        <input type="text" name="father_given_name" value={person.father_given_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Middle Name</label>
        <input type="text" name="father_middle_name" value={person.father_middle_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Extension</label>
        <input type="text" name="father_ext" value={person.father_ext || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Nickname</label>
        <input type="text" name="father_nickname" value={person.father_nickname || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Education Level</label>
        <input type="text" name="father_education_level" value={person.father_education_level || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Last School</label>
        <input type="text" name="father_last_school" value={person.father_last_school || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Course</label>
        <input type="text" name="father_course" value={person.father_course || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Year Graduated</label>
        <input type="text" name="father_year_graduated" value={person.father_year_graduated || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father School Address</label>
        <input type="text" name="father_school_address" value={person.father_school_address || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Contact</label>
        <input type="text" name="father_contact" value={person.father_contact || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Occupation</label>
        <input type="text" name="father_occupation" value={person.father_occupation || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Employer</label>
        <input type="text" name="father_employer" value={person.father_employer || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Income</label>
        <input type="text" name="father_income" value={person.father_income || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Father Email</label>
        <input type="text" name="father_email" value={person.father_email || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>


      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Deceased</label>
        <input type="text" name="mother_deceased" value={person.mother_deceased || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Family Name</label>
        <input type="text" name="mother_family_name" value={person.mother_family_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Given Name</label>
        <input type="text" name="mother_given_name" value={person.mother_given_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Middle Name</label>
        <input type="text" name="mother_middle_name" value={person.mother_middle_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Extension</label>
        <input type="text" name="mother_ext" value={person.mother_ext || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Nickname</label>
        <input type="text" name="mother_nickname" value={person.mother_nickname || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Education Level</label>
        <input type="text" name="mother_education_level" value={person.mother_education_level || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Last School</label>
        <input type="text" name="mother_last_school" value={person.mother_last_school || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Course</label>
        <input type="text" name="mother_course" value={person.mother_course || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Year Graduated</label>
        <input type="text" name="mother_year_graduated" value={person.mother_year_graduated || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother School Address</label>
        <input type="text" name="mother_school_address" value={person.mother_school_address || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Contact</label>
        <input type="text" name="mother_contact" value={person.mother_contact || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Occupation</label>
        <input type="text" name="mother_occupation" value={person.mother_occupation || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Employer</label>
        <input type="text" name="mother_employer" value={person.mother_employer || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Income</label>
        <input type="text" name="mother_income" value={person.mother_income || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mother Email</label>
        <input type="text" name="mother_email" value={person.mother_email || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Guardian</label>
        <input type="text" name="guardian" value={person.guardian || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Guardian Family Name</label>
        <input type="text" name="guardian_family_name" value={person.guardian_family_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Guardian Given Name</label>
        <input type="text" name="guardian_given_name" value={person.guardian_given_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Guardian Middle Name</label>
        <input type="text" name="guardian_middle_name" value={person.guardian_middle_name || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Guardian Name Extension</label>
        <input type="text" name="guardian_ext" value={person.guardian_ext || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Guardian Nickname</label>
        <input type="text" name="guardian_nickname" value={person.guardian_nickname || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Guardian Address</label>
        <input type="text" name="guardian_address" value={person.guardian_address || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Guardian Contact</label>
        <input type="text" name="guardian_contact" value={person.guardian_contact || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Guardian Email</label>
        <input type="text" name="guardian_email" value={person.guardian_email || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>


            <div className="mb-4">
        <label className="block mb-1 font-medium">Annual Income</label>
        <input type="text" name="annual_income" value={person.annual_income || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">School Level</label>
        <input type="text" name="schoolLevel" value={person.schoolLevel || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">School Last Attended</label>
        <input type="text" name="schoolLastAttended" value={person.schoolLastAttended || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">School Address</label>
        <input type="text" name="schoolAddress" value={person.schoolAddress || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Course Program</label>
        <input type="text" name="courseProgram" value={person.courseProgram || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Honor</label>
        <input type="text" name="honor" value={person.honor || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">General Average</label>
        <input type="text" name="generalAverage" value={person.generalAverage || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Year Graduated</label>
        <input type="text" name="yearGraduated" value={person.yearGraduated || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Strand</label>
        <input type="text" name="strand" value={person.strand || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Cough</label>
        <input type="checkbox" name="cough" checked={person.cough || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Colds</label>
        <input type="checkbox" name="colds" checked={person.colds || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Fever</label>
        <input type="checkbox" name="fever" checked={person.fever || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Asthma</label>
        <input type="checkbox" name="asthma" checked={person.asthma || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Fainting Spells</label>
        <input type="checkbox" name="faintingSpells" checked={person.faintingSpells || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Heart Disease</label>
        <input type="checkbox" name="heartDisease" checked={person.heartDisease || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Tubercolosis</label>
        <input type="checkbox" name="tubercolosis" checked={person.tubercolosis || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Frequent Headaches</label>
        <input type="checkbox" name="frequentHeadaches" checked={person.frequentHeadaches || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Hernia</label>
        <input type="checkbox" name="hernia" checked={person.hernia || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Chronic Cough</label>
        <input type="checkbox" name="chronicCough" checked={person.chronicCough || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Head Neck Injury</label>
        <input type="checkbox" name="headNeckInjury" checked={person.headNeckInjury || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">HIV</label>
        <input type="checkbox" name="hiv" checked={person.hiv || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">High Blood Pressure</label>
        <input type="checkbox" name="highBloodPressure" checked={person.highBloodPressure || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Diabetes Mellitus</label>
        <input type="checkbox" name="diabetesMellitus" checked={person.diabetesMellitus || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Allergies</label>
        <input type="checkbox" name="allergies" checked={person.allergies || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Cancer</label>
        <input type="checkbox" name="cancer" checked={person.cancer || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Smoking Cigarettes</label>
        <input type="checkbox" name="smokingCigarette" checked={person.smokingCigarette || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Alcohol Drinking</label>
        <input type="checkbox" name="alcoholDrinking" checked={person.alcoholDrinking || false} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      {/* This should be a checkbox instead of a text input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Hospitalized</label>
        <input type="checkbox" name="hospitalized" checked={person.hospitalized === 1} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>


      <div className="mb-4">
        <label className="block mb-1 font-medium">Hospitalization Details</label>
        <input type="text" name="hospitalizationDetails" value={person.hospitalizationDetails || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Medication</label>
        <input type="text" name="medications" value={person.medications || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Had Covid</label>
        <input type="text" name="hadCovid" value={person.hadCovid || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Covid Date</label>
        <input type="text" name="covidDate" value={person.covidDate || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Vaccine 1 Brand</label>
        <input type="text" name="vaccine1Brand" value={person.vaccine1Brand || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Vaccine 1 Date</label>
        <input type="text" name="vaccine1Date" value={person.vaccine1Date || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Vaccine 2 Brand</label>
        <input type="text" name="vaccine2Brand" value={person.vaccine2Brand || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Vaccine 2 Date</label>
        <input type="text" name="vaccine2Date" value={person.vaccine2Date || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Booster 1 Brand</label>
        <input type="text" name="booster1Brand" value={person.booster1Brand || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Booster 1 Date</label>
        <input type="text" name="booster1Date" value={person.booster1Date || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Booster 2 Brand</label>
        <input type="text" name="booster2Brand" value={person.booster2Brand || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Booster 2 Date</label>
        <input type="text" name="booster2Date" value={person.booster2Date || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Chest Xray</label>
        <input type="text" name="chestXray" value={person.chestXray || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium"> CBC</label>
        <input type="text" name="cbc" value={person.cbc || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Urinalysis</label>
        <input type="text" name="urinalysis" value={person.urinalysis || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Other Workups</label>
        <input type="text" name="otherworkups" value={person.otherworkups || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Symptoms Today</label>
        <input type="text" name="symptomsToday" value={person.symptomsToday || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Remarks</label>
        <input type="text" name="remarks" value={person.remarks || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Terms Of Agreement</label>
        <input type="text" name="termsofAgreement" value={person.termsOfAgreement || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>


      


      <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Save Changes
      </button>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
    </Box>
  );
};


export default Dashboard1;
