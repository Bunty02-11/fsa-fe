import { Box, Button, TextField, useTheme } from "@mui/material";
import { Formik, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import axios from "axios";

const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [schemeName, setSchemeName] = useState('')
  const [schemeType, setSchemeType] = useState('')
  // const [values,setValues] = useState('')
  // const { setValues } = useFormikContext(); // Get setValues function from Formik context

  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    let success = false;
    let retryCount = 0;
    const token = localStorage.getItem('token');

    while (!success && retryCount < 3) {
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

        if (response.statusCode === 409) {
          throw new Error('Scheme already exists');
        }

        if (!response.ok) {
          throw new Error('Failed to create scheme');
        }

        const data = await response.json();
        console.log('Scheme created successfully:', data);

        setSchemes([...schemes, data.data]);

        success = true;
        toast.success('Scheme created successfully');
        resetForm();
      } catch (error) {
        console.error('Error creating scheme:', error.message);
        retryCount++;
        if (error.message === 'Scheme already exists') {
          toast.warning('Scheme already exists');
          break; // No need to retry if the scheme already exists
        } else {
          toast.error('Failed to create scheme');
        }
      }
    }
    setLoading(false);
  };

  const handleEdit = async (row, setValues) => {
    // console.log(row)
    try {
      setEditData(row);
      setSchemeName(row.schemeName);
      setSchemeType(row.schemeType);
      setValues({
        scheme: row.schemeName,
        type: row.schemeType,
        id: row.id,
      });


    } catch (error) {
      console.error('Error setting edit data:', error.message);
    } finally {
      setLoading(false);
    }

  };
  // console.log(editData)

  const handleUpdateForm = async (values, { reseForm }) => {
    console.log(values, 'da')
    // Implement logic to update scheme data based on editData and values
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const body = {
        schemeName: values.scheme,
        schemeType: values.type
      }
      console.log(body)
      const response = await axios.put(`https://ykbog3ly9j.execute-api.ap-south-1.amazonaws.com/production/api/schemes/${values.id}`, body, {
        headers: {
          'Authorization': `${token}`,
        },
      })
      console.log(response, 'res')
      // resetForm();
      // const response = await fetch(`https://ykbog3ly9j.execute-api.ap-south-1.amazonaws.com/production/api/schemes/${values.id}`, {
      //   method: 'PUT', // Update method for editing
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `${token}`,
      //   },
      //   body: JSON.stringify(values),
      // });

      if (response.status !== 200) {
        throw new Error('Failed to update scheme');
      }


      const updatedScheme = response.data;
      // console.log(updatedScheme)
      const updatedSchemes = schemes.map((scheme) => (scheme.id === editData.id ? updatedScheme : scheme));
      
      setSchemes(updatedSchemes);
      setEditData(null); // Clear edit data after successful update
      // resetForm();
      toast.success('Scheme updated successfully');
    } catch (error) {
      console.error('Error updating scheme:', error.message);
      toast.error('Failed to update scheme');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this scheme?");
    if (confirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://ykbog3ly9j.execute-api.ap-south-1.amazonaws.com/production/api/schemes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete scheme');
        }

        const updatedSchemes = schemes.filter((scheme) => scheme.id !== id);
        setSchemes(updatedSchemes);
        toast.success('Scheme deleted successfully');
      } catch (error) {
        console.error('Error deleting scheme:', error.message);
        toast.error('Failed to delete scheme');
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
    {
      field: "actions",
      headerName: "Actions",
      width: 150, // Adjusted width to accommodate two buttons
      renderCell: (params) => (
        // console.log(params)
        <>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row)}
            disabled={!!editData} // Disable edit button while editing another scheme
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
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
      {/*  */}
      <Formik
        onSubmit={editData ? handleUpdateForm : handleFormSubmit}
        initialValues={{
          scheme: editData ? editData.schemeName : "",
          type: editData ? editData.schemeType : "",
          id: editData ? editData.id : null,
        }}
        validationSchema={checkoutSchema}
        enableReinitialize // This allows initialValues to be updated when editData changes
      >

        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          loading,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns={
                isMobile ? "repeat(4, minmax(0, 1fr))" : "1fr"
              }
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Scheme Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.scheme}
                name="scheme"
                error={!!touched.scheme && !!errors.scheme}
                helperText={touched.scheme && errors.scheme}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Scheme Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.type}
                name="type"
                error={!!touched.type && !!errors.type}
                helperText={touched.type && errors.type}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={loading} // Disable button while loading
              >
                {editData ? "Update Scheme" : (loading ? "Creating..." : "Create New Scheme")}
              </Button>
            </Box>
          </form>
        )}
      </Formik>


      {/*  */}
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
          <DataGrid checkboxSelection rows={schemes ? schemes : []} columns={columns} />

        </Box>
      </Box>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  scheme: yup.string().required("required"),
  type: yup.string().required("required"),
});

const initialValues = {
  scheme: "",
  type: "",
};

export default Form;
