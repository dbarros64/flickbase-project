import * as Yup from 'yup';


export const formValues = {
    title: '',
    content: '',
    excerpt: '',
    score: '',
    director: '',
    actors: [],
    status: 'draft'
};


export const validation = () => (
    Yup.object({
        title: Yup.string()
        .required('Sorry, a title is required'),
        content: Yup.string()
        .required('Sorry, content is required')
        .min(50, 'That is it?? Write some more'),
        excerpt: Yup.string()
        .required('Sorry an excerpt is required')
        .max(500, 'Sorry, the max characters is 500'),
        score: Yup.number()
        .required('Sorry a score is required')
        .min(0, 'Zero is the minumum score')
        .max(100, '100 is the max score'),
        director: Yup.string()
        .required('A director is required'),
        actors: Yup.array()
        .required('Adding actors is required')
        .min(3, 'Please ensure you have a minumum of three actors'),
        status: Yup.string()
        .required('Sorry a status is required, Public or Draft')
    })
)