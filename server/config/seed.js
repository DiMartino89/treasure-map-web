/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var location = require('../api/location/location.model');
var Category = require('../api/category/category.model');

var categories = [new Category({
  name: 'Geocaches',
  imgUrl: 'assets/images/GeocachingPin00.png'
}), new Category({
  name: 'Sights & Culture',
  imgUrl: 'assets/images/SightsAndCulturePin00.png'
}), new Category({
  name: 'Food & Drink',
  imgUrl: 'assets/images/FoodDrinkPin00.png'
}), new Category({
  name: 'Leisure',
  imgUrl: 'assets/images/LeisurePin00.png'
}), new Category({
  name: 'Shopping',
  imgUrl: 'assets/images/ShoppingPin00.png'
}), new Category({
  name: 'Accommodation',
  imgUrl: 'assets/images/AccommodationPin00.png'
}), new Category({
  name: 'Other',
  imgUrl: 'assets/images/LeisurePin01.png'
}), new Category({
  name: 'Sports',
  imgUrl: 'assets/images/SportsPin00.png'
}), new Category({
  name: 'Events',
  imgUrl: 'assets/images/EventPin02.png'
})];

Category.find({}).remove(function () {
  Category.create(categories, function () {
      console.log('finished populating categories');
    }
  );
});

Thing.find({}).remove(function () {
  Thing.create({
    name: 'Development Tools',
    info: 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name: 'Server and Client integration',
    info: 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name: 'Smart Build System',
    info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  }, {
    name: 'Modular Structure',
    info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
  }, {
    name: 'Optimized Build',
    info: 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  }, {
    name: 'Deployment Ready',
    info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

var test = new User({
  provider: 'local',
  name: 'Test User',
  email: 'test@test.com',
  password: 'test',
  description: 'I am Test User and I like to do somenthing spontaneously! ;)',
  status: 'Free this evening...'
});
var test2 = new User({
  provider: 'local',
  name: 'Test User 2',
  email: 'test2@test.com',
  password: 'test'
});
var test3 = new User({
  provider: 'local',
  name: 'Test User 3',
  email: 'test3@test.com',
  password: 'test'
});
var admin = new User({
  provider: 'local',
  role: 'admin',
  name: 'Admin',
  email: 'admin@admin.com',
  password: 'admin',
  friends: [test._id, test2._id]
});

var users = [admin, test, test2, test3];
User.find({}).remove(function () {
  User.create(users, function () {
    console.log('finished populating users');
  });
});

location.find({}).remove(function () {
  location.create([{
    address: {
      street: '112 rue du Faubourg Saint-Honore',
      city: 'Paris',
      zipcode: '75008'
    },
    coordinates: {
      latitude: 48.8718282,
      longitude: 2.31499899
    },
    details: {
      name: 'Epicure',
      category: categories[2]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Paul-Lincke-Ufer 21',
      city: 'Berlin',
      zipcode: '10999'
    },
    coordinates: {
      latitude: 52.4942,
      longitude: 13.42957
    },
    details: {
      name: 'Restaurant VOLT',
      category: categories[2]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Marlene-Dietrich-Platz 2',
      city: 'Berlin',
      zipcode: '10785'
    },
    coordinates: {
      latitude: 52.508116,
      longitude: 13.372982
    },
    details: {
      name: 'Vox Restaurant',
      category: categories[2]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Poststraße 17',
      city: 'Berlin',
      zipcode: '10178'
    },
    coordinates: {
      latitude: 52.51631,
      longitude: 13.40784
    },
    details: {
      name: 'Gasthaus Zur Rippe',
      category: categories[2]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Poststraße 28',
      city: 'Berlin',
      zipcode: '10178'
    },
    coordinates: {
      latitude: 52.517241,
      longitude: 13.4064
    },
    details: {
      name: 'Zur Gerichtslaube',
      category: categories[2]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Köpenicker Straße 18-20',
      city: 'Berlin',
      zipcode: '10997'
    },
    coordinates: {
      latitude: 52.505579,
      longitude: 13.432972
    },
    details: {
      name: 'Sage Restaurant',
      category: categories[2]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Am Treptower Park 14',
      city: 'Berlin',
      zipcode: '12435'
    },
    coordinates: {
      latitude: 52.4904928,
      longitude: 13.4578314
    },
    details: {
      name: 'Park Center Treptow',
      category: categories[4]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Schnellerstraße 21',
      city: 'Berlin',
      zipcode: '12439'
    },
    coordinates: {
      latitude: 52.45685,
      longitude: 13.50842
    },
    details: {
      name: 'Zentrum Schöneweide',
      category: categories[4]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Frankfurter Allee 111',
      city: 'Berlin',
      zipcode: '10247'
    },
    coordinates: {
      latitude: 52.5141263,
      longitude: 13.4745089
    },
    details: {
      name: 'Ring-Center Berlin',
      category: categories[4]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Grunerstraße 20',
      city: 'Berlin',
      zipcode: '10179'
    },
    coordinates: {
      latitude: 52.519902,
      longitude: 13.414794
    },
    details: {
      name: 'Alexa Berlin',
      category: categories[4]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Bahnhofstraße 33-38',
      city: 'Berlin',
      zipcode: '12555'
    },
    coordinates: {
      latitude: 52.4581599,
      longitude: 13.57750229
    },
    details: {
      name: 'Forum Köpenick',
      category: categories[4]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Pariser Platz',
      city: 'Berlin',
      zipcode: '10117'
    },
    coordinates: {
      latitude: 52.5158566,
      longitude: 13.3784283
    },
    details: {
      name: 'Brandenburg Gate',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Bodestrasse 1-3',
      city: 'Berlin',
      zipcode: '10178'
    },
    coordinates: {
      latitude: 52.5194894,
      longitude: 13.3988334
    },
    details: {
      name: 'Pergamon Museum',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Bernauer Strasse 111/119',
      city: 'Berlin',
      zipcode: '13355'
    },
    coordinates: {
      latitude: 52.53523,
      longitude: 13.38943
    },
    details: {
      name: 'Memorial of the Berlin Wall',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Platz der Republik',
      city: 'Berlin',
      zipcode: '11011'
    },
    coordinates: {
      latitude: 52.518535,
      longitude: 13.373188
    },
    details: {
      name: 'Reichstag',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Bodestrasse',
      city: 'Berlin',
      zipcode: '10178'
    },
    coordinates: {
      latitude: 52.5199172,
      longitude: 13.3990756
    },
    details: {
      name: 'Museum Island',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Alexander Platz',
      city: 'Berlin',
      zipcode: '10178'
    },
    coordinates: {
      latitude: 52.521918,
      longitude: 13.413215
    },
    details: {
      name: 'Alexanderplatz',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Olympischer Platz 3',
      city: 'Berlin',
      zipcode: '14053'
    },
    coordinates: {
      latitude: 52.5146,
      longitude: 13.2397
    },
    details: {
      name: 'Olympiastadion',
      category: categories[7]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/']
    },
    owner: admin._id
  }, {
    address: {
      street: 'Mercedes-Platz 1',
      city: 'Berlin',
      zipcode: '10243'
    },
    coordinates: {
      latitude: 52.505857,
      longitude: 13.443553
    },
    details: {
      name: 'Onkelz Konzert',
      category: categories[8]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/'],
	  dateTime: '09/22/2016 15:00',
      duration: 2
    },
    owner: test2
  }, {
    address: {
      street: 'Strasse des 17. Juni',
      city: 'Berlin',
      zipcode: '10557'
    },
    coordinates: {
      latitude: 52.512906,
      longitude: 13.3267274
    },
    details: {
      name: 'Tiergarten',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/'],
	  dateTime: '09/25/2016 15:00',
      duration: 2
    },
    owner: test
  }, {
    address: {
      street: 'Gendarmenmarkt',
      city: 'Berlin',
      zipcode: '10117'
    },
    coordinates: {
      latitude: 52.513722,
      longitude: 13.39267
    },
    details: {
      name: 'Gendarmenmarkt',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/'],
	  dateTime: '09/19/2016 15:00',
      duration: 2
    },
    owner: test
  }, {
    address: {
      street: 'Panoramastrasse 1A',
      city: 'Berlin',
      zipcode: '10178'
    },
    coordinates: {
      latitude: 52.52086,
      longitude: 13.4093
    },
    details: {
      name: 'Television Tower',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/'],
	  dateTime: '09/19/2016 15:00',
      duration: 2
    },
    owner: test
  }, {
    address: {
      street: 'Trebbiner Strasse 9',
      city: 'Berlin',
      zipcode: '10963'
    },
    coordinates: {
      latitude: 52.4986278,
      longitude: 13.3768443
    },
    details: {
      name: 'German Museum of Technology',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/'],
	  dateTime: '09/22/2016 15:00',
      duration: 3
    },
    owner: test2
  }, {
    address: {
      street: 'Spandauer Damm 20-24',
      city: 'Berlin',
      zipcode: '14059'
    },
    coordinates: {
      latitude: 52.5242681,
      longitude: 13.2918291
    },
    details: {
      name: 'Charlottenburg Palace',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/'],
	  dateTime: '09/17/2016 15:00',
      duration: 3
    },
    owner: test2
  }, {
    address: {
      street: 'Karl-Liebknecht-Strasse 1',
      city: 'Berlin',
      zipcode: '10178'
    },
    coordinates: {
      latitude: 52.519133,
      longitude: 13.402634
    },
    details: {
      name: 'DDR Museum',
      category: categories[1]._id,
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ',
	  publication: true,
      pictures: ['http://friedrichshainblog.de/wp-content/uploads/2011/01/elfia-bar-und-restaurant-berlin-friedrichshain.jpg', 'http://www.berlin.de/binaries/adressen/70673/source/1355764576/667x500/'],
	  dateTime: '09/18/2016 15:00',
      duration: 2
    },
    owner: test3
  }], function (err, locations) {
    console.log('finished populating locations');
  });
});