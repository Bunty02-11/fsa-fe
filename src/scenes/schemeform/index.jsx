import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect ,useState } from "react";

const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [schemes, setSchemes] = useState([]);

  const handleFormSubmit = async(values) => {
    let success = false;
    let retryCount = 0;
    const token = localStorage.getItem('token'); // Assuming your token is stored in localStorage under the key 'token'

    while (!success && retryCount < 3) { // Retry logic added with a maximum of 3 retries
      try {
        const response = await fetch('https://ykbog3ly9j.execute-api.ap-south-1.amazonaws.com/production/api/schemes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
          body: JSON.stringify({
            schemeName: values.scheme,
            schemeType: values.type,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to create scheme');
        }
    
        const data = await response.json();
        // console.log('Scheme created successfully:', data);
        success = true; // Set success to true to break out of the loop
        toast.success('Scheme created successfully'); // 
      } catch (error) {

        // console.error('Error creating scheme:', error.message);
        retryCount++; // Increment the retry count on each failure
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.error('Failed to create scheme');  // Wait for 1 second before retrying
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "schemeName",
      headerName: "Scheme Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "schemeType",
      headerName: "Scheme Type",
      flex: 1,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://ykbog3ly9j.execute-api.ap-south-1.amazonaws.com/production/api/schemes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': ` ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch schemes');
        }

        const data = await response.json();
        console.log('Schemes fetched successfully:', data);
        setSchemes(data.data);

        // Here you can set the fetched data to your state or do further processing
      } catch (error) {
        console.error('Error fetching schemes:', error.message);
        toast.error('Failed to fetch schemes'); // Show error message using toast
      }
    };

    fetchData();
  }, []); // Fetch data only once when the component mounts



  return (
    <Box m={isMobile ? "10px" : "20px"}>
      <Header title="CREATE SCHEME" subtitle="Create a New Scheme" />
      <ToastContainer position="bottom-right" autoClose={5000} />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns={isMobile ? "repeat(4, minmax(0, 1fr))" : "1fr"}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Scheme-Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.scheme}
                name="scheme"
                error={!!touched.scheme && !!errors.scheme}
                helperText={touched.scheme && errors.scheme}
                sx={{ gridColumn: isMobile ? "span 4" : "auto" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Type Of Scheme"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.type}
                name="type"
                error={!!touched.type && !!errors.type}
                helperText={touched.type && errors.type}
                sx={{ gridColumn: isMobile ? "span 4" : "auto" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Scheme
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Box m="20px">
        <Header title="SCHEMES" subtitle="List of Schemes" />
        <Box
          m="40px 0 0 0"
          height="45vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <DataGrid checkboxSelection rows={schemes} columns={columns} />
        </Box>
      </Box>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  scheme: yup.string().required("required"),
  type: yup.string().required("required"),
});

const initialValues = {
  scheme: "",
  type: "",
};

export default Form;
