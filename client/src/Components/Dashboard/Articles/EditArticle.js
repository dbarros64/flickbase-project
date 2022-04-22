import React, { useState, useEffect, useRef } from "react";
import AdminLayout from '../../../HOC/AdminLayout';

import { useFormik, FormikProvider, FieldArray } from 'formik';
import { useDispatch, useSelector } from "react-redux";
import { getAdminArticle, updateArticle } from '../../../Redux/Actions/articleActions';
import { validation, formValues } from './validationSchema';
import { clearCurrent } from "../../../Redux/Actions/index";
import Loader from '../../../Utils/Loader';
import WYSISWYG from "../../../Utils/Forms/Wysiswyg";

import {
    TextField,
    Button,
    Divider,
    Chip,
    Paper,
    InputBase,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add';

const EditArticle = (props) => {
    const notifications = useSelector(state => state.notifications);
    const articles = useSelector(state => state.articles);
    const [editorBlur, setEditorBlur] = useState(false);
    const dispatch = useDispatch();
    const[isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(formValues);
    const actorsValue = useRef('')

    // EDIT
    const [editContent, setEditContent] = useState(null);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: formData,
        validationSchema: validation,
        onSubmit: (values, { resetForm }) => {
            setIsSubmitting(true);
            dispatch(updateArticle(values, props.match.params.id));
        }
    });

    const handleEditorState = (state) => {
        formik.setFieldValue('content', state, true)
    };

    const handleEditorBlur = (blur) => {
        setEditorBlur(true)
    }


    const errorHelper = (formik, values) => ({
        error:formik.errors[values] && formik.touched[values] ? true : false,
        helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values] : null
    });

    useEffect(() => {
        if (notifications && notifications.success) {
            props.history.push('/dashboard/articles')
        }
        if (notifications && notifications.error) {
            setIsSubmitting(false);
        }
    }, [notifications, props.history]);


    // EDIT
    useEffect(() => {
        dispatch(getAdminArticle(props.match.params.id))

    }, [dispatch, props.match.params]);


    useEffect(() => {

        if (articles && articles.current) {
            setFormData(articles.current)
            setEditContent(articles.current.content)
        }

    }, [articles])


    useEffect(() => {
        return () => {
            dispatch(clearCurrent())
        }

    }, [dispatch])

    return (
        <AdminLayout section="Edit Article">
            {isSubmitting ?
                <Loader />
                :
                <form className="mt-3 article_form" onSubmit={formik.handleSubmit} >
                <div className="form-group">
                    <TextField 
                        style={{width: "100%"}}
                        name="title"
                        label="Enter a title"
                        variant="outlined"
                        {...formik.getFieldProps('title')}
                        {...errorHelper(formik, 'title')}
                    />
                </div>

                <div className="form-group">
                    <WYSISWYG 
                        setEditorState={(state) => handleEditorState(state)}
                        setEditorBlur={(blur) => handleEditorBlur(blur)}
                        editContent={editContent}
                    />

                    {formik.errors.content && editorBlur ?
                        <FormHelperText error={true}>
                            {formik.errors.content}
                        </FormHelperText>
                    : null}

                    <TextField 
                        type="hidden"
                        name='content'
                        {...formik.getFieldProps('content')}
                    />
                </div>

                <div className="form-group">
                    <TextField 
                        style={{width: "100%"}}
                        name="excerpt"
                        label="Enter an excerpt"
                        variant="outlined"
                        {...formik.getFieldProps('excerpt')}
                        {...errorHelper(formik, 'excerpt')}
                        multiline
                        minRows={4}
                    />
                </div>
                
                <Divider className="mt-3 mb-3"/>
                <h5>Movie data and score</h5>
                <div className="form-group">
                    <TextField 
                        style={{width: "100%"}}
                        name="score"
                        label="Enter a score"
                        variant="outlined"
                        {...formik.getFieldProps('score')}
                        {...errorHelper(formik, 'score')}
                    />
                </div>

                <FormikProvider value={formik}>
                    <h5>Add the actors</h5>
                    <FieldArray 
                        name='actors'
                        render={(arrayHelpers) => (
                            <div>
                                <Paper className="actors_form">
                                    <InputBase 
                                        inputRef={actorsValue}
                                        className="input"
                                        placeholder="Add actor name here"
                                    />
                                    <IconButton
                                        onClick={() => {
                                            arrayHelpers.push(actorsValue.current.value)
                                            actorsValue.current.value = ''
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Paper>
                                {formik.errors.actors && formik.touched.actors ?
                                    <FormHelperText error={true}>
                                        {formik.errors.actors}
                                    </FormHelperText>
                                : null}
                                
                                <div className="chip_container">
                                    {formik.values.actors.map((actor, index) => (
                                        <div key={index}>
                                            <Chip 
                                                label={`${actor}`}
                                                color='primary'
                                                onDelete={() => arrayHelpers.remove(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    />
                </FormikProvider>


                <div className="form-group">
                    <TextField 
                        style={{width: "100%"}}
                        name="director"
                        label="Enter a director"
                        variant="outlined"
                        {...formik.getFieldProps('director')}
                        {...errorHelper(formik, 'director')}
                    />
                </div>

                <FormControl variant='outlined'>
                    <h5>Select a status</h5>
                    <Select
                        name="status"
                        {...formik.getFieldProps('status')}
                        error={formik.errors.status && formik.touched.status ? true : false}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="public">Public</MenuItem>
                    </Select>
                    { formik.errors.status && formik.touched.status ?
                        <FormHelperText error={true}>
                            {formik.errors.status}
                        </FormHelperText>
                    : null}
                </FormControl>


                <Divider className="mt-3 mb-3"/>
                <Button
                    variant="contained"
                    color='primary'
                    type="submit"
                    // disabled={false}
                >
                    Edit Article
                </Button>
            </form>
            
            }

            
        </AdminLayout>
    )
};


export default EditArticle;