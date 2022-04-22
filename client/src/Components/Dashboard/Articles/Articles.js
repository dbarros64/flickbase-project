import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../HOC/AdminLayout';
import { 
    getPaginateArticles, 
    changeStatusArticle, 
    removeArticle } 
from '../../../Redux/Actions/articleActions';
import PaginationComponent from './Paginate';


import { useDispatch, useSelector } from 'react-redux';
import { 
    Modal,
    Button,
    ButtonToolbar,
    ButtonGroup,
    InputGroup,
    FormControl
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';



const Articles = (props) => {
    const articles = useSelector(state => state.articles);
    const notifications = useSelector(state => state.notifications);
    const dispatch = useDispatch();
    const [removeAlert, setRemoveAlert] = useState(false);
    const [toRemove, setToRemove] = useState(null);
    let arts = articles.adminArticles


    const editArtsAction = (id) => {
        props.history.push(`/dashboard/articles/edit/${id}`)
    };

    const handleClose = () => {
        setRemoveAlert(false)
    };

    const handleShow = (id=null) => {
        setToRemove(id)
        setRemoveAlert(true)
    };

    const handleDelete = () => {
        dispatch(removeArticle(toRemove))
    }


    const goToPrevPage = (page) => {
        dispatch(getPaginateArticles(page))
    };

    const goToNextPage = (page) => {
        dispatch(getPaginateArticles(page))
    };

    const handleStatusChange = (status, _id) => {
        let newStatus = status === 'draft' ? 'public' : 'draft'
        dispatch(changeStatusArticle(newStatus, _id))
    };


    useEffect(() => {
        dispatch(getPaginateArticles())

    }, [dispatch]);

    useEffect(() => {
        handleClose()
        if (notifications && notifications.removeArticle) {
            dispatch(getPaginateArticles(arts.page))
        }

    }, [notifications, dispatch, arts])

    return (
        <AdminLayout section="Articles">
            <div className='articles_table'>
                <ButtonToolbar className='mb-3'>
                    <ButtonGroup className='mr-2'>
                        <LinkContainer to='/dashboard/articles/add'>
                            <Button variant='secondary'>Add article</Button>
                        </LinkContainer>
                    </ButtonGroup>
                    <form onSubmit={() => alert('search')}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="btnGroupAddon2">@</InputGroup.Text>
                            </InputGroup.Prepend>
                        
                        <FormControl 
                            type="text"
                            placeholder='Example'
                        />
                        </InputGroup>
                    </form>
                </ButtonToolbar>

                <PaginationComponent 
                    arts={arts}
                    prev={(page) => goToPrevPage(page)}
                    next={(page) => goToNextPage(page)}
                    handleShow={(id) => handleShow(id)}
                    handleStatusChange={(status, id) => handleStatusChange(status, id)}
                    editArtsAction={(id) => editArtsAction(id)}

                />

                <Modal show={removeAlert} onHide={handleClose} >
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        There is no going back, be sure!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={handleClose}>
                            Oops! Close this
                        </Button>
                        <Button variant='danger' onClick={() => handleDelete()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

               
            </div>
        </AdminLayout>
    )
};


export default Articles;