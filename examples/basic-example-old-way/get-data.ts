import { Series, Season, Episode } from './data-helpers';

export function getSeriesData() {
    return Series.asTypedCollection([
        new Series({
            seriesId: 1,
            title: 'SeriesIT Crowd',
            releaseDate: new Date('2006-02-03'),
            seriesInfo:
                'The IT Crowd is a British sitcom produced by Channel 4, written by Graham Linehan, produced by ',
        }),
        /*   new Series({
            seriesId: 2,
            title: 'Silicon Valley',
            releaseDate: new Date('2014-04-06'),
            seriesInfo: `Silicon Valley is an American comedy television series created by Mike Judge, John Altschuler and \n
                Dave Krinsky. The series focuses on five young men who founded a startup company in Silicon Valley.`,
        }),*/
    ]);
}

export function getSeasonsData() {
    return Season.asTypedCollection([
        new Season({
            seriesId: 1,
            seasonId: 1,
            title: 'Season 1',
            firstAired: new Date('2006-02-03'),
            lastAired: new Date('2006-03-03'),
        }),
        new Season({
            seriesId: 1,
            seasonId: 2,
            title: 'Season 2',
            firstAired: new Date('2007-08-24'),
            lastAired: new Date('2007-09-28'),
        }),
        new Season({
            seriesId: 1,
            seasonId: 3,
            title: 'Season 3',
            firstAired: new Date('2008-11-21'),
            lastAired: new Date('2008-12-26'),
        }),
        new Season({
            seriesId: 1,
            seasonId: 4,
            title: 'Season 4',
            firstAired: new Date('2010-06-25'),
            lastAired: new Date('2010-07-30'),
        }),
        new Season({
            seriesId: 2,
            seasonId: 1,
            title: 'Season 1',
            firstAired: new Date('2014-04-06'),
            lastAired: new Date('2014-06-01'),
        }),
        new Season({
            seriesId: 2,
            seasonId: 2,
            title: 'Season 2',
            firstAired: new Date('2015-04-12'),
            lastAired: new Date('2015-06-14'),
        }),
        new Season({
            seriesId: 2,
            seasonId: 3,
            title: 'Season 3',
            firstAired: new Date('2016-04-24'),
            lastAired: new Date('2016-06-26'),
        }),
        new Season({
            seriesId: 2,
            seasonId: 4,
            title: 'Season 4',
            firstAired: new Date('2017-04-23'),
            lastAired: new Date('2017-06-25'),
        }),
        new Season({
            seriesId: 2,
            seasonId: 5,
            title: 'Season 5',
            firstAired: new Date('2018-03-25'),
            lastAired: new Date('2018-05-13'),
        }),
    ]);
}

export function getEpisodesData() {
    return Episode.asTypedCollection([
        new Episode({
            seriesId: 1,
            seasonId: 1,
            episodeId: 1,
            title: "Yesterday's JairDate: am",
            airDate: new Date('2006-02-03'),
        }),
        new Episode({ seriesId: 1, seasonId: 1, episodeId: 2, title: 'Calamity Jen', airDate: new Date('2006-02-03') }),
        new Episode({ seriesId: 1, seasonId: 1, episodeId: 3, title: 'Fifty-Fifty', airDate: new Date('2006-02-10') }),
        new Episode({ seriesId: 1, seasonId: 1, episodeId: 4, title: 'The Red Door', airDate: new Date('2006-02-17') }),
        new Episode({
            seriesId: 1,
            seasonId: 1,
            episodeId: 5,
            title: 'The Haunting of BairDate: ill Crouse',
            airDate: new Date('2006-02-24'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 1,
            episodeId: 6,
            title: 'Aunt Irma Visits',
            airDate: new Date('2006-03-03'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 2,
            episodeId: 1,
            title: 'The Work Outing',
            airDate: new Date('2006-08-24'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 2,
            episodeId: 2,
            title: 'Return of the GairDate: olden Child',
            airDate: new Date('2007-08-31'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 2,
            episodeId: 3,
            title: 'Moss and the GairDate: erman',
            airDate: new Date('2007-09-07'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 2,
            episodeId: 4,
            title: 'The Dinner Party',
            airDate: new Date('2007-09-14'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 2,
            episodeId: 5,
            title: 'Smoke and Mirrors',
            airDate: new Date('2007-09-21'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 2,
            episodeId: 6,
            title: 'Men Without Women',
            airDate: new Date('2007-09-28'),
        }),
        new Episode({ seriesId: 1, seasonId: 3, episodeId: 1, title: 'From Hell', airDate: new Date('2008-11-21') }),
        new Episode({
            seriesId: 1,
            seasonId: 3,
            episodeId: 2,
            title: 'Are We Not MairDate: en?',
            airDate: new Date('2008-11-28'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 3,
            episodeId: 3,
            title: 'Tramps Like Us',
            airDate: new Date('2008-12-05'),
        }),
        new Episode({ seriesId: 1, seasonId: 3, episodeId: 4, title: 'The Speech', airDate: new Date('2008-12-12') }),
        new Episode({ seriesId: 1, seasonId: 3, episodeId: 5, title: 'Friendface', airDate: new Date('2008-12-19') }),
        new Episode({
            seriesId: 1,
            seasonId: 3,
            episodeId: 6,
            title: 'Calendar Geeks',
            airDate: new Date('2008-12-26'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 4,
            episodeId: 1,
            title: 'Jen The Fredo',
            airDate: new Date('2010-06-25'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 4,
            episodeId: 2,
            title: 'The Final Countdown',
            airDate: new Date('2010-07-02'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 4,
            episodeId: 3,
            title: 'Something Happened',
            airDate: new Date('2010-07-09'),
        }),
        new Episode({
            seriesId: 1,
            seasonId: 4,
            episodeId: 4,
            title: 'Italian For Beginners',
            airDate: new Date('2010-07-16'),
        }),
        new Episode({ seriesId: 1, seasonId: 4, episodeId: 5, title: 'Bad Boys', airDate: new Date('2010-07-23') }),
        new Episode({
            seriesId: 1,
            seasonId: 4,
            episodeId: 6,
            title: 'Reynholm vs Reynholm',
            airDate: new Date('2010-07-30'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 1,
            episodeId: 1,
            title: 'Minimum Viable Product',
            airDate: new Date('2014-04-06'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 1,
            episodeId: 2,
            title: 'The Cap Table',
            airDate: new Date('2014-04-13'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 1,
            episodeId: 3,
            title: 'Articles of Incorporation',
            airDate: new Date('2014-04-20'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 1,
            episodeId: 4,
            title: 'Fiduciary Duties',
            airDate: new Date('2014-04-27'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 1,
            episodeId: 5,
            title: 'Signaling Risk',
            airDate: new Date('2014-05-04'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 1,
            episodeId: 6,
            title: 'Third Party Insourcing',
            airDate: new Date('2014-05-11'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 1,
            episodeId: 7,
            title: 'Proof of Concept',
            airDate: new Date('2014-05-18'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 1,
            episodeId: 8,
            title: 'Optimal Tip-toairDate: -Tip Efficiency',
            airDate: new Date('2014-06-01'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 2,
            episodeId: 1,
            title: 'Sand Hill Shuffle',
            airDate: new Date('2015-04-12'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 2,
            episodeId: 2,
            title: 'Runaway Devaluation',
            airDate: new Date('2015-04-19'),
        }),
        new Episode({ seriesId: 2, seasonId: 2, episodeId: 3, title: 'Bad Money', airDate: new Date('2015-04-26') }),
        new Episode({ seriesId: 2, seasonId: 2, episodeId: 4, title: 'The Lady', airDate: new Date('2015-05-03') }),
        new Episode({ seriesId: 2, seasonId: 2, episodeId: 5, title: 'Server Space', airDate: new Date('2015-05-10') }),
        new Episode({ seriesId: 2, seasonId: 2, episodeId: 6, title: 'Homicide', airDate: new Date('2015-05-17') }),
        new Episode({
            seriesId: 2,
            seasonId: 2,
            episodeId: 7,
            title: 'Adult Content',
            airDate: new Date('2015-05-24'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 2,
            episodeId: 8,
            title: 'White Hat/BlairDate: ack Hat',
            airDate: new Date('2015-05-31'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 2,
            episodeId: 9,
            title: 'Binding Arbitration',
            airDate: new Date('2015-06-07'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 2,
            episodeId: 1,
            title: 'Two Days of tairDate: he Condor',
            airDate: new Date('2015-06-14'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 3,
            episodeId: 1,
            title: 'Founder Friendly',
            airDate: new Date('2016-04-24'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 3,
            episodeId: 2,
            title: 'Two in the BairDate: ox',
            airDate: new Date('2016-05-01'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 3,
            episodeId: 3,
            title: "Meinertzhagen's HairDate: aversack",
            airDate: new Date('2016-05-08'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 3,
            episodeId: 4,
            title: 'Maleant Data Systems SairDate: olutions',
            airDate: new Date('2016-05-15'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 3,
            episodeId: 5,
            title: 'The Empty Chair',
            airDate: new Date('2016-05-22'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 3,
            episodeId: 6,
            title: 'Bachmanity Insanity',
            airDate: new Date('2016-05-29'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 3,
            episodeId: 7,
            title: 'To Build a BairDate: etter Beta',
            airDate: new Date('2016-06-05'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 3,
            episodeId: 8,
            title: "Bachman's EairDate: arnings Over-Ride",
            airDate: new Date('2016-06-12'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 3,
            episodeId: 9,
            title: 'Daily Active Users',
            airDate: new Date('2016-06-19'),
        }),
        new Episode({ seriesId: 2, seasonId: 3, episodeId: 1, title: 'The Uptick', airDate: new Date('2016-06-26') }),
        new Episode({
            seriesId: 2,
            seasonId: 4,
            episodeId: 1,
            title: 'Success Failure',
            airDate: new Date('2017-04-23'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 4,
            episodeId: 2,
            title: 'Terms of Service',
            airDate: new Date('2017-04-30'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 4,
            episodeId: 3,
            title: 'Intellectual Property',
            airDate: new Date('2017-05-07'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 4,
            episodeId: 4,
            title: 'Teambuilding Exercise',
            airDate: new Date('2017-05-14'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 4,
            episodeId: 5,
            title: 'The Blood Boy',
            airDate: new Date('2017-05-21'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 4,
            episodeId: 6,
            title: 'Customer Service',
            airDate: new Date('2017-05-28'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 4,
            episodeId: 7,
            title: 'The Patent Troll',
            airDate: new Date('2017-06-04'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 4,
            episodeId: 8,
            title: 'The Keenan Vortex',
            airDate: new Date('2017-06-11'),
        }),
        new Episode({ seriesId: 2, seasonId: 4, episodeId: 9, title: 'Hooli-Con', airDate: new Date('2017-06-18') }),
        new Episode({ seriesId: 2, seasonId: 4, episodeId: 1, title: 'Server Error', airDate: new Date('2017-06-25') }),
        new Episode({
            seriesId: 2,
            seasonId: 5,
            episodeId: 1,
            title: 'Grow Fast or DairDate: ie Slow',
            airDate: new Date('2018-03-25'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 5,
            episodeId: 2,
            title: 'Reorientation',
            airDate: new Date('2018-04-01'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 5,
            episodeId: 3,
            title: 'Chief Operating Officer',
            airDate: new Date('2018-04-08'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 5,
            episodeId: 4,
            title: 'Tech Evangelist',
            airDate: new Date('2018-04-15'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 5,
            episodeId: 5,
            title: 'Facial Recognition',
            airDate: new Date('2018-04-22'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 5,
            episodeId: 6,
            title: 'Artificial Emotional Intelligence',
            airDate: new Date('2018-04-29'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 5,
            episodeId: 7,
            title: 'Initial Coin Offering',
            airDate: new Date('2018-05-06'),
        }),
        new Episode({
            seriesId: 2,
            seasonId: 5,
            episodeId: 8,
            title: 'Fifty-One PairDate: ercent',
            airDate: new Date('2018-05-13'),
        }),
    ]);
}