var artistRoster = {

	bill : {
		name :'Bill Kaulitz',
		country : 'Germany',
		website : 'http://www.tokiohotel.com/',
		genre : 'Pop Rock',
		facts : {
			first: 'Favorite Food - Pizza',
			second: 'Favorite Pet - Pumba (Dog)'
		}
	}, 

	tom : {
		name :'Tom Kaulitz',
		country : 'Germany',
		website : 'http://www.tokiohotel.com/',
		genre : 'Pop Rock',
		facts : {
			first: 'Favorite Food - Pizza',
			second: 'Favorite Hobby - Playing Guitar'
		}
	}, 

	gustav : {
		name :'Gustav Schafer',
		country : 'Germany',
		website : 'http://www.tokiohotel.com/',
		genre : 'Pop Rock',
		facts : {
			first: 'Favorite Drink - Beer',
			second: 'Favorite Hobby - Playing Drums'
		}
	}, 

	georg : {
		name :'Georg Listing',
		country : 'Germany',
		website : 'http://www.tokiohotel.com/',
		genre : 'Pop Rock',
		facts : {
			first: 'Favorite Food - Cheeseburger',
			second: 'Favorite Hobby - Playing Bass'
		}
	}, 

}

for (var artist in artistRoster) {
	var artistInfo = artistRoster[artist];

	//step 1 - make the contrainer (div)
	var container = document.createElement('div');

	var artistName = document.createElement('h3');
	artistName.setAttribute("class", "name");
	artistName.innerHTML = 'Artist Name : ' + artistInfo.name;
	document.body.appendChild(artistName);

	var artistCountry = document.createElement('p');
	artistCountry.setAttribute("class", "country");
	artistCountry.innerHTML = 'Country : ' + artistInfo.country;
	document.body.appendChild(artistCountry);

	var artistWebsite = document.createElement('p');
	artistWebsite.setAttribute("class", "website");
	artistWebsite.innerHTML = 'Website : '+ artistInfo.website;
	document.body.appendChild(artistWebsite);

	var artistGenre = document.createElement('p');
	artistGenre.setAttribute("class", "genre");
	artistGenre.innerHTML = 'Genre : ' + artistInfo.genre;
	document.body.appendChild(artistGenre);

	var artistFact = document.createElement('p');
	artistFact.setAttribute("class", "factone");
	artistFact.innerHTML = 'First Fact : ' + artistInfo.facts.first;
	document.body.appendChild(artistFact);

	var artistFactTwo = document.createElement('p');
	artistFactTwo.setAttribute("class", "facttwo");
	artistFactTwo.innerHTML = 'Second Fact : ' + artistInfo.facts.second;
	document.body.appendChild(artistFactTwo);


}

