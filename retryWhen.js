
const { interval } = require('rxjs');
const {
  takeWhile,
  map,
  take,
  retryWhen,
  delay,
  tap,
} = require('rxjs/operators');

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

// showNamesOnWatchList$ emits the names of all the shows
// on the users watch list.
showNamesOnWatchList$().pipe(
  // If an error occurs then show the error and
  // retryWhen 5 seconds have passed
  retryWhen(errors => errors.pipe(
    // show what the errors is
    tap(errors => console.log(`${errors}. Waiting 5 seconds...`)),

    // wait 5 seconds before another retry
    delay(5000),

    // This will keep retrying for ever afte 5 second intervals
    // we can limit this by specifying the number of attempts
    // including the initial attempt
    take(2)
  ))
).subscribe(
  showName => console.log(showName),
  error => console.log('This error function never gets called'),
  () => console.log('Done listing all available shows...')
);
