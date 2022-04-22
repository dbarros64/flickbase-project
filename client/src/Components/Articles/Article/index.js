import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getArticle } from '../../../Redux/Actions/articleActions';
import { clearCurrent } from '../../../Redux/Actions/index';
import Loader from '../../../Utils/Loader';
import ScoreCard from '../../../Utils/ScoreCard';


const Article = (props) => {
    const { current } = useSelector(state => state.articles);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getArticle(props.match.params.id))
    }, [dispatch, props.match.params]);


    useEffect(() => {
        return () => {
            dispatch(clearCurrent())
        }
        
    }, [dispatch])


    return (
        <>
            { current ?
                    <div className='article_container'>
                    <div 
                        className='image'
                        style={{ background: `url(https://picsum.photos/1920/1080)`}}
                    >

                    </div>
                    <h1>{current.title}</h1>
                    <div className='mt-3 content'>
                        <div dangerouslySetInnerHTML={
                            {__html: current.content}
                        }>

                        </div>
                    </div>
                    <ScoreCard current={current} />
            </div>
            : <Loader /> }
           
        </>
    )
};


export default Article;