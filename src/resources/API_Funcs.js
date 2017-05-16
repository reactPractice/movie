import $ from 'jquery';
import * as actions from '../actions';
import {store} from '../index';

const KEY = "268d70c982dabbd56d9db882a7112594";

class API_Funcs{
    
    constructor() {
        rating:[
                [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]  
            ];
    }
    /*
    favoriteMovies_EachUser(movieData) {
        let that = this;
        return new Promise((resolve, reject) => {
                resolve($.post('https://moon-test-heroku.herokuapp.com/findUser/favorite/movie', {id: localStorage.getItem('loginId')}, function(data, status){
                    //data.genre : pointer
                    //data.index : pointer.index
                    let replaced_rating = [
                        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]  
                    ];
                    let sortedItemByGenre = [
                        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]  
                    ];
                    let dataToSort = data.movies;
                    
                    // 받아온 데이터를 장르별로 재 분류
                    // Resorting data by genre
                    for(let i=0; i<dataToSort.length; i++){
                        sortedItemByGenre[dataToSort[i].genre].push(dataToSort[i]);    
                    }
                    
                    // sortedItemByGenre 정렬
                    // Sort sortedItemByGenre
                    for(let i=0; i<sortedItemByGenre.length; i++){
                        if(sortedItemByGenre[i].length != 0) {
                            sortedItemByGenre[i].sort((prev, next) => {
                                return prev.index - next.index;
                            })
                        }
                    }
                    //console.log('내용:' + JSON.stringify(movieData))
                    // 별점 셋팅
                    // Initialize rating of each favorite movie
                    let idx = 0;
                    for(let i=0; i<movieData.length; i++){
                        for(let j=0; j<movieData[i].length; j++){
                            if(sortedItemByGenre[i].length > idx && sortedItemByGenre[i][idx].index === j) {
                                replaced_rating[i].push({stars: sortedItemByGenre[i][idx].rating});
                                idx++;
                            }
                            else{
                                replaced_rating[i].push({stars: 0})
                            }
                        }
                        idx=0;
                    }
                    
                    console.log('뤠이팅:' + JSON.stringify(replaced_rating));
                    that.rating = replaced_rating;
                    store.dispatch(actions.set_favorite_rating(replaced_rating));
                }))
        })
    }*/
    
    favoriteMovies_EachUser(page) {
        let that = this;
        return new Promise((resolve, reject) => {
                resolve($.post('https://moon-test-heroku.herokuapp.com/findUser/favorite/movie', {id: localStorage.getItem('loginId')}, function(data, status){
                    //data.genre : pointer
                    //data.index : pointer.index
                    let replaced_rating = [
                        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]  
                    ];
                    let sortedItemByGenre = [
                        [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]  
                    ];
                    let dataToSort = data.movies;
                    
                    // 받아온 데이터를 장르별로 재 분류
                    // Resorting data by genre
                    for(let i=0; i<dataToSort.length; i++){
                        sortedItemByGenre[dataToSort[i].genre].push(dataToSort[i]);    
                    }
                    
                    // sortedItemByGenre 정렬
                    // Sort sortedItemByGenre
                    for(let i=0; i<sortedItemByGenre.length; i++){
                        if(sortedItemByGenre[i].length != 0) {
                            sortedItemByGenre[i].sort((prev, next) => {
                                return prev.index - next.index;
                            })
                        }
                    }
                    //console.log('내용:' + JSON.stringify(movieData))
                    // 별점 셋팅
                    // Initialize rating of each favorite movie
                    let idx = 0;
                    for(let i=0; i<18; i++){
                        for(let j=0; j<page*20; j++){
                            if(sortedItemByGenre[i].length > idx && sortedItemByGenre[i][idx].index === j) {
                                replaced_rating[i].push({stars: sortedItemByGenre[i][idx].rating});
                                idx++;
                            }
                            else{
                                replaced_rating[i].push({stars: 0})
                            }
                        }
                        idx=0;
                    }
                    
                    console.log('뤠이팅:' + JSON.stringify(replaced_rating));
                    that.rating = replaced_rating;
                    store.dispatch(actions.set_favorite_rating(replaced_rating));
                }))
        })
    }
    
    empty() {
        new Promise((resolve, reject) => {
            resolve(store.dispatch(actions.remove_rating()));
        }).then(() => {
            store.dispatch(actions.removeMovies_API());
        })
        .then(()=>console.log('empty'))
    }
    
    // initialRating(movieData){
    initialRating(page){
        // this.favoriteMovies_EachUser(movieData)
        this.favoriteMovies_EachUser(page)
        .then(() => {
        })
        .then(() => {return console.log('생성자를 통한 접근:' + JSON.stringify(this.rating))})
        .catch(() => {return console.log.bind(console)})
    }
    
    movieFromAPIServer(page, genre) {
        let data = {};
        new Promise((resolve, reject) => {
            resolve($.ajax({
                url: 'https://api.themoviedb.org/3/discover/movie?api_key=' + KEY + 
                    '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=' + 
                    page + '&with_genres=' + genre,
                type: 'GET',
                success: function(result) {
                    data = result.results;
                },
                error: function(err) {
                    console.error(err);
                }
            }))
        })
        .then(() => {
            return store.dispatch(actions.nextPage());
        })
        //.then(() => console.log(JSON.stringify(data)))
        .then(() => {
            data.map((data, i) => {
                let state = {};
                state.original_title = data.original_title;
                state.overview = data.overview;
                state.release_date = data.release_date;
                state.vote_arrange = data.vote_average;
                state.vote_count = data.vote_count;
                state.poster_path = "http://image.tmdb.org/t/p/w185/" + data.poster_path;
                state.popularity = data.popularity;
                
                store.dispatch(actions.storeMovies_API(state));
            });
        })
        .then(() => {return console.log('뭐지;')})
        .catch(() => console.log.bind(console));
    }
    
}
 
export default API_Funcs;