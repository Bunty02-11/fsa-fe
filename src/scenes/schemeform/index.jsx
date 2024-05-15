// src/components/SchemeForm.js

import React, { useEffect } from 'react';
import { Box, Button, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchemes, createScheme, updateScheme, deleteScheme, setEditData, clearEditData } from '../../actions/schemeAction';

const SchemeForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { schemes, loading, editData } = useSelector((state) => state.schemes);

  useEffect(() => {
    dispatch(fetchSchemes());
  }, [dispatch]);

  const handleFormSubmit = (values, { resetForm }) => {
    dispatch(createScheme(values)).then(() => resetForm());
  };

  const handleEdit = (row) => {
    dispatch(setEditData(row));
  };

  const handleUpdateForm = (values) => {
    dispatch(updateScheme(values));
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this scheme?");
    if (confirmed) {
      dispatch(deleteScheme(id));
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
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row)}
            disabled={!!editData}
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

  return (
    <Box m={isMobile ? "10px" : "20px"}>
      <Header title="CREATE SCHEME" subtitle="Create a New Scheme" />
      <ToastContainer position="bottom-right" autoClose={5000} />
      <Formik
        onSubmit={editData ? handleUpdateForm : handleFormSubmit}
        initialValues={{
          scheme: editData ? editData.schemeName : "",
          type: editData ? editData.schemeType : "",
          id: editData ? editData.id : null,
        }}
        validationSchema={checkoutSchema}
        enableReinitialize
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
                disabled={loading}
              >
                {editData ? "Update Scheme" : (loading ? "Creating..." : "Create New Scheme")}
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
          <DataGrid checkboxSelection rows={schemes || []} columns={columns} />
        </Box>
      </Box>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  scheme: yup.string().required("required"),
  type: yup.string().required("required"),
});

export default SchemeForm;
