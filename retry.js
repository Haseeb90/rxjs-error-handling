
const { interval } = require('rxjs');
const { takeWhile, map, catchError, retry } = require('rxjs/operators');

const watchList = [
  {
    name: "The Last Kingdom",
    seasons: 4,
    rating: 9.5,
    isOnWatchList: true
  },
  {
    name: "Love Death and Robots",
    seasons: 1,
    rating: 9.8,
    isOnWatchList: true
  },
  {
    name: "The Show Down",
    seasons: 6,
    rating: 10,
    isOnWatchList: true
  }
];

const trending = [
  {
    name: "Arrested Development",
    seasons: 5,
    rating: 9.5,
    isOnWatchList: false
  },
];

function showNamesOnWatchList$() {
  return interval(1000).pipe(
    takeWhile(value => value < watchList.length),
    map(value => {
      if (value === 2) {
        // Throw an error 
        // Won't emit "The Show Down"
        throw 'Unable to get name of the show...';
      }
      else {
        return watchList[value].name
      }
    })
  );
}

function showNamesOnTrendingList$() {
  return interval(1000).pipe(
    takeWhile(value => value < trending.length),
    map(value => trending[value].name)
  );
}

// showNamesOnWatchList$ emits the names of all the shows
// on the users watch list.
showNamesOnWatchList$().pipe(
  // If an error occurs, retry 2 times
  retry(1),

  // If continues to happen after the 2 retries 
  // catch it and switch over to the stream 
  // that's live and emits trending shows.
  catchError(error => showNamesOnTrendingList$()),
).subscribe(
  showName => console.log(showName),
  error => console.log('This error function never gets called'),
  () => console.log('Done listing all available shows...')
);
