import * as articles from './index';
import axios from 'axios';
import { getAuthHeader } from '../../Utils/Tools';


axios.defaults.headers.post['Content-Type'] = 'application/json';


export const getArticles = (sort) => {
    return async (dispatch, getState) => {
        try {
            const arts = await axios.post(`/api/articles/loadmore`, sort);

           
            const prevArts = getState().articles.articles;

            let newArts = [...arts.data]

            if (prevArts) {
                newArts = [...prevArts, ...arts.data]
            }

            dispatch(articles.getArticles(newArts));
            // dispatch(articles.successGlobal('Awesome'))

        } catch (error) {
            dispatch(articles.errorGlobal('Oops, there was an error loading articles'));
        }
    }
};

export const getArticle = (id) => {
    return async (dispatch) => {
        try {
            const request = await axios.get(`/api/articles/get_byid/${id}`)
            dispatch(articles.getArticle(request.data[0]))
        } catch (error) {
            dispatch(articles.errorGlobal(error.response.data.message));
        }
    }
};

export const addArticle = (article) => {
    return async (dispatch) => {
        try {
            const request = await axios.post(`/api/articles/admin/add_article`, article, getAuthHeader())

            dispatch(articles.addArticle(request.data));
            dispatch(articles.successGlobal('The article has been added'))

        } catch (error) {
            dispatch(articles.errorGlobal(error.response.data.message));
        }
    }
};


export const getPaginateArticles = (page=1, limit=5) => {
    return async (dispatch) => {
        try {
            const request = await axios.post(`/api/articles/admin/paginate`, {
                page,
                limit
            }, getAuthHeader());

            dispatch(articles.getPaginateArticles(request.data));

        } catch (error) {
            dispatch(articles.errorGlobal(error.response.data.message))
        }
    };
};


export const changeStatusArticle = (status, _id) => {
    return async (dispatch, getState) => {
        try {

            const article = await axios.patch(`/api/articles/admin/${_id}`, {
                status
            }, getAuthHeader())
         

            let art = article.data
            let state = getState().articles.adminArticles.docs; // get previous state
            let position = state.findIndex(art => art._id === _id) // Find the position what to update
            state[position] = art;

            // now update redux state
            dispatch(articles.updateArticleStatus(state));
            dispatch(articles.successGlobal('The article successfully updated!'))
            

        } catch (error) {
            dispatch(articles.errorGlobal(error.response.data.message));
        }
    }
};


export const removeArticle = (id) => {
    return async (dispatch) => {
        try {
            await axios.delete(`/api/articles/admin/${id}`, getAuthHeader())

            dispatch(articles.removeArticle())

            dispatch(articles.successGlobal('The article has been removed'))

        } catch (error) {
            dispatch(articles.errorGlobal(error.response.data.message))
        }
    }
};


export const getAdminArticle = (id) => {
    return async (dispatch) => {
        try {
            const request = await axios.get(`/api/articles/admin/${id}`, getAuthHeader())
            dispatch (articles.getArticle(request.data))

        } catch (error) {
            dispatch(articles.getArticle(error.response.data.message))
        }
    }
};


export const updateArticle = (article, id) => {
    return async (dispatch) => {
        try {
            const newArticle = await axios.patch(`/api/articles/admin/${id}`, article, getAuthHeader());

            dispatch(articles.getArticle(newArticle.data));
            dispatch(articles.successGlobal('Update completed successfully.'))

        } catch (error) {
            dispatch(articles.errorGlobal('Error updating. Please try again.'))
        }
    }
}