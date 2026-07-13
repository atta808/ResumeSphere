sed -i 's/const \[companyName, setCompanyName\] = useState('"''"');/const \[companyName, setCompanyName\] = useState(route.params?.companyName || '"''"');/' src/screens/interview/InterviewConfigurationScreen.js
sed -i 's/const \[position, setPosition\] = useState('"''"');/const \[position, setPosition\] = useState(route.params?.position || '"''"');/' src/screens/interview/InterviewConfigurationScreen.js
sed -i 's/const { profile } = useProfile();/const { profile } = useProfile();\n  const route = useRoute();/' src/screens/interview/InterviewConfigurationScreen.js
sed -i 's/import { useNavigation } from '"'@react-navigation\/native'"';/import { useNavigation, useRoute } from '"'@react-navigation\/native'"';/' src/screens/interview/InterviewConfigurationScreen.js
sed -i 's/const defaultResumeId = resumes\[0\].id;/const defaultResumeId = route.params?.resumeId || resumes\[0\].id;\n      const jobDescriptionId = route.params?.jobDescriptionId || null;/' src/screens/interview/InterviewConfigurationScreen.js
sed -i 's/resumeId: defaultResumeId,/resumeId: defaultResumeId,\n        jobDescriptionId,/' src/screens/interview/InterviewConfigurationScreen.js
