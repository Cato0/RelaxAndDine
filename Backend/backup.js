var express = require('express');
var bodyParser = require('body-parser');
var cors = require ('cors');
var http = require('http');
var app = express();
var router = express.Router();

var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var fs = require('fs');
var ip = 'localhost';

var collectionName = 'RestaurantsAustria';				// Restaurants in Österreich + TestRestaurants in der nähe
var collectionName2 = 'RestaurantsTempAustria';

var url = 'mongodb://'+'localhost'+':27017/exampleDb';

var debug = require('debug')('http');

app.use(cors());
app.use(express.static('public'));
app.use (bodyParser.json());

console.log("hallo");
debug('listening');

var bochumData = [
	{
		name: "Kleinherberstraße 9",
		rating: 3,
		img: "img/RelaxAndDine_images/restaurant_1",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [51.45444, 7.293753]
		},
		homepage: 'www.gaststaettefigl.at',
		tel: '+432742257402',
		description: "Zutaten<br>„wir verwenden überwiegend Produkte aus der Region um die hohe Qualität unserer Speisen sicherstellen zu können. Selbstverständlich für uns ist, vieles selber herzustellen, wie  Marmelade, Eis & Sorbet, Nudeln, sogar den Saiblingkaviar und einiges mehr“ Peter Heneis, Küchenchef<br><br><b>Küchenzeiten</b><br>Dienstag-Samstag 11.30-14.00 und 18.00-21.30 Uhr<br>Ruhetage: Sonntag, Montag & Feiertag<br><br><b>T</b> &nbsp;<a href='tel:+432742257402'>++43 2742 / 25 74 02</a><br><br><b>W</b> <a href='http://www.gaststaettefigl.at'>www.gaststaettefigl.at</a>"
	},{
	
		name: "Birkhuhnweg 9A",
		rating: 5,
		img: "img/RelaxAndDine_images/restaurant_2",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [51.461947, 7.304786]
		},
		homepage: 'www.jagawirt.at',
		tel: '+4331438105',
		description: "Frische Speisen aus selbst angebautem Gemüse und frischen Kräutern werden bei uns im Wirtshaus mit viel Liebe zubereitet. Alle unsere Zutaten stammen aus der eigenen Landwirtschaft oder von Bauern aus der Umgebung! Zu den kulinarischen Highlights zählen unsere Lamm- und Waldschein-Spezialitäten und selbstverständlich unser Spanferkel, das Sie unbedingt einmal probiert haben sollten.<br><br><b>Ruhetag</b><br><br>Nov-Aug: Mittwoch & Donnerstag<br>Sept-Okt: Mittwoch<br><br><b>T</b>  &nbsp;<a href='tel:+4331438105'>+43 3143 / 81 05</a><br><br><b>W</b> <a href='http://www.jagawirt.at'>www.jagawirt.at</a>"
	},{
		name: "Marktstraße 261",
		rating: 3,
		img: "img/RelaxAndDine_images/restaurant_3",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [51.448575, 7.236697]
		},
		homepage: 'www.huegellandhof.eu',
		tel: '+4331332201',
		description: "<b>Kulinarisch genießen</b><br><br>Bereits am Morgen bereiten wir Ihnen mit unserem reichhaltigen Frühstücksbuffet kulinarische Genüsse. Die große Auswahl an Köstlichkeiten und heimischen Produkten ist für Sie der beste Start in einen aktiven Tag. Von Montag bis Freitag bieten wir Ihnen neben den a la carte Gerichten auch ein 3-gängiges Mittagsmenü. Am Nachmittag können Sie sich bei Schönwetter auf unserer wunderschönen, von Markisen geschützten Terrasse, bei Kaffee und frischen hausgemachten Torten und Kuchen stärken. Oder Sie lassen sich einen unserer kreativen Eisbecher am Gaumen zergehen. Den kulinarischen Höhepunkt des Tages bildet das Abendessen im Hügellandhof. Hausgemachte Pastavariationen, frische Süss- und Salzwasserfische, Rindfleischspezialitäten, saisonelle Produkte, wie z.B. Bärlauch, Spargel, Pilze, Kürbis, Wild, Martinigansl und vieles mehr machen Ihren Besuch in unserem Restaurant zu einem außergewöhnlichen Geschmackserlebnis.<br>Bei der Wahl des Weines beraten Sie unsere Servicemitarbeiter sehr gerne. Das „Verdauungs-Schnapserl“ können Sie aus einem großzügigen Angebot an erlesenen Bränden und Schnäpsen aus unserer Spirituosen-Bar wählen.<br><br><b>Öffnungszeiten</b><br>Mo-Sa 7-24 Uhr, Sonn- u. Feiertag 8-17 Uhr<br>Juni – Juli – August, Sonn- u. Feiertag 8-21 Uhr<br><br><b>Küche</b><br>Mo-Sa 10-21:30 Uhr, Sonn- u. Feiertag 9-15 Uhr<br>Juni – Juli – August, Sonn- u. Feiertag 9-21 Uhr<br><br><b>T</b>  &nbsp;<a href='tel:+4331332201'>+43 3133 – 2201</a><br><br><b>W</b> <a href='http://www.huegellandhof.eu'>www.huegellandhof.eu</a>"
	},{
		name: "Pizzeria Pisa",
		rating: 2,
		img: "img/RelaxAndDine_images/restaurant_4",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [51.454658, 7.2483]
		},
		homepage: 'www.hoagascht.at/de/restaurant/flachau.html',
		tel: '+43645732490',
		description: "Außergewöhnliche Kreationen<br>knuspriges Entenmaki mit Waldorfsalat, gebratenes Sashimi vom Alpenlachs, Rollmops vom Saiblingsfilet, Bulgogi koreanisch, gelbes Curry mit Weisskraut, unsere berühmte Pongauer Fischsuppe im Steintopf, Tobleronemousse im Blumentopf mit schwarzer Erde,...<br><b>Hoagascht's Hochlandrind Rindfleischküche:</b><br>Carpaccio mit Kalamansi Erbsenmarinade, das Schulterscherzel HL, 18 Stunden gegart bei 78°C und unsere saftigen Aged Steaks vom Huft, Filet und Rib Eye, natürlich alles Hochlandrind! Wiener Melange - 'Traditionell gekochtes Rindfleischim Kupferkessel'.<br><br><b>Öffnungszeiten:</b><br>Mittwoch bis Montag von 11 Uhr bis 14 Uhr und 17 Uhr 30 -  21 Uhr 30<br>Dienstag Ruhetag<br><br><b>T</b>  &nbsp;<a href='tel:+43645732490'>+43645732490</a><br><br><b>W</b> <a href='http://www.hoagascht.at/de/restaurant/flachau.html'>www.hoagascht.at/de/restaurant/flachau.html</a>"
	},{
		name: "Pizzeria Palermo",
		rating: 1,
		img: "img/RelaxAndDine_images/restaurant_5",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [51.455694, 7.236108]
		},
		homepage: 'www.toedtling-kapfenberg.at/eissalon.html',
		tel: '+43386231295',
		description: "Unser Eissalon bietet Ihnen eine große Auswahl von Eissorten, zu denen immer wieder neue Kreationen hinzu kommen, um Ihnen den Sommer zu versüßen.<br>Unser Sortiment reicht von Frappès verschiedener Sorten, bis hin zu leckeren Eisknödeln.Was gibt es Schöneres, als an einem heißem Sommertag unsere Eisspezialitäten zu genießen? Auch an kühlen Tagen schmecken unsere 24 täglich frischen Eissorten, aus eigener Erzeugung, ausgezeichnet. Unser Eis wird ausschließlich aus augesuchten Naturprodukten und frischen Früchten der besten Qualität erzeugt. Bei uns können sie Ihren stressigen Tag mit einer schmackhaften Eiskreation herrlich ausklingen lassen.Versuchen Sie auch unsere Eistorten und Eisknödel aus eigener Produktion!<br><br><b>T</b>  &nbsp;<a href='tel:+43386231295'>+ 43 3862 31 2 95</a><br><br><b>W</b> <a href='http://www.toedtling-kapfenberg.at/eissalon.html'>www.toedtling-kapfenberg.at/eissalon.html</a>'Unser Eissalon bietet Ihnen eine große Auswahl von Eissorten, zu denen immer wieder neue Kreationen hinzu kommen, um Ihnen den Sommer zu versüßen.<br>Unser Sortiment reicht von Frappès verschiedener Sorten, bis hin zu leckeren Eisknödeln. Was gibt es Schöneres, als an einem heißem Sommertag unsere Eisspezialitäten zu genießen? Auch an kühlen Tagen schmecken unsere 24 täglich frischen Eissorten, aus eigener Erzeugung, ausgezeichnet. Unser Eis wird ausschließlich aus augesuchten Naturprodukten und frischen Früchten der besten Qualität erzeugt. Bei uns können sie Ihren stressigen Tag mit einer schmackhaften Eiskreation herrlich ausklingen lassen.Versuchen Sie auch unsere Eistorten und Eisknödel aus eigener Produktion!<br><br><b>T</b>  &nbsp;<a href='tel:+43386231295'>+ 43 3862 31 2 95</a><br><br><b>W</b> <a href='http://www.toedtling-kapfenberg.at/eissalon.html'>www.toedtling-kapfenberg.at/eissalon.html</a>'"
	},{
		name: "Fortuna Apotheke",
		rating: 5,
		img: "img/RelaxAndDine_images/restaurant_6",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [51.464117 , 7.236966]
		},
		homepage: 'www.kollerwirt.com',
		tel: '+4342232455',
		description: "Das traditionsreiche Gasthaus Kollerwirt liegt am Tanzenberg, hoch über dem Zollfeld. Es ist längst kein Geheimtipp mehr, sondern entwickelte sich zu einem beliebten Ausflugsort für Gourmets.<br>Die Küche ist einfach aber geschmackvoll und es wird mit regionalen Produkten gearbeitet. Hier kann man herrlich im schattigen Gastgarten mit Blick auf den Ulrichsberg oder in der rustikal eingerichteten Gaststuben verweilen. Der Kollerwirt punktet mit gutbürgerlicher Küche, von knusprigen Backhendl bis Filet-Steak, Mohntorte bis Crème Brûlée. Im Sommer wird jeden Dienstag gegrillt, Freitags gibt es frischen Fisch aus der Region.<br><br><b>Öffnungszeiten</b><br>SA, SO und Feiertag – ab 12.00 Uhr<br>MO, DO, FR – ab 17.00 Uhr<br>DI und MI – Ruhetag, außer vor einem Feiertag – ab 17.00 Uhr.<br><br>SOMMERZEIT:<br>Juli und August, täglich ab 17.00 Uhr<br>SA und SO – ab 12.00 Uhr<br>Juni und September – MI Ruhetag<br><br><b>T</b>  &nbsp;<a href='tel:+4342232455'>+43 4223/24 55</a><br><br><b>M</b>  &nbsp;<a href='tel:+436647959706'>+43 664/79 59 706</a><br><br><b>W</b> <a href='http://www.kollerwirt.com'>www.kollerwirt.com</a>"
	},{
		name: "Steinring",
		rating: 5,
		img: "img/RelaxAndDine_images/restaurant_7",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [51.464117, 7.231778]
		},
		homepage: 'www.tetter.com',
		tel: '+433687215991',
		description: "Seit 1910 gibt es bereits den Gasthof Tetter und wird bereits in der 4. Generation weitergeführt.<br>„Dem Alten verpflichtet & dem Neuen aufgeschlossen“<br>Wir servieren unseren Hausgästen ein 4- gängiges Abendmenü. In unserer Küche bereiten wir alles frisch und mit ausgewählten saisonalen Produkten zu. Hausgemachte Spezialitäten, Rindfleisch aus eigener Biolandwirtschaft, vegetarische Speisen, frischer Fisch & Wild aus heimischer Region. Für unsere Gäste die unser Menü nicht in Anspruch nehmen haben wir natürlich eine kleine Karte.<br><br><b>Öffnungszeiten</b><br><br>Hotelbetrieb Sommer 2017<br>18.05 – 01.10.2017<br><br>Warme Küche<br>an Sonn und Feiertagen für a la carte Gäste<br>12.00 -  13.30<br>17.30 -  20.00<br><br>Hotelbetrieb Winter 2017/2018<br>14.12. 2017  – 02. 04. 2018<br><br>Warme Küche<br>an Sonn- und Feiertagen für a la carte Gäste<br>12.00 -  13.30<br>17.30 -  20.00<br><br><b>T</b>  &nbsp;<a href='tel:+433687215991'>+43 3687 215991</a><br><br><b>W</b> <a href='http://www.tetter.com'>www.tetter.com</a>"

	}
];

var oesterreichData = [{
	
		name: "Wirtshaus Jagawirt",
		rating: 5,
		img: "img/Restaurants_Oesterreich_V01/WirtshausJagawirt",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [46.9359382, 15.2001822]
		},
		homepage: 'www.jagawirt.at',
		tel: '+4331438105',
		description: "Frische Speisen aus selbst angebautem Gemüse und frischen Kräutern werden bei uns im Wirtshaus mit viel Liebe zubereitet. Alle unsere Zutaten stammen aus der eigenen Landwirtschaft oder von Bauern aus der Umgebung! Zu den kulinarischen Highlights zählen unsere Lamm- und Waldschein-Spezialitäten und selbstverständlich unser Spanferkel, das Sie unbedingt einmal probiert haben sollten.<br><br><b>Ruhetag</b><br><br>Nov-Aug: Mittwoch & Donnerstag<br>Sept-Okt: Mittwoch<br><br><b>T</b>  &nbsp;<a href='tel:+4331438105'>+43 3143 / 81 05</a><br><br><b>W</b> <a href='http://www.jagawirt.at'>www.jagawirt.at</a>"
	},{
		name: "Hügellandhof",
		rating: 3,
		img: "img/Restaurants_Oesterreich_V01/Huegellandhof",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [47.057475, 15.599759]
		},
		homepage: 'www.huegellandhof.eu',
		tel: '+4331332201',
		description: "<b>Kulinarisch genießen</b><br><br>Bereits am Morgen bereiten wir Ihnen mit unserem reichhaltigen Frühstücksbuffet kulinarische Genüsse. Die große Auswahl an Köstlichkeiten und heimischen Produkten ist für Sie der beste Start in einen aktiven Tag. Von Montag bis Freitag bieten wir Ihnen neben den a la carte Gerichten auch ein 3-gängiges Mittagsmenü. Am Nachmittag können Sie sich bei Schönwetter auf unserer wunderschönen, von Markisen geschützten Terrasse, bei Kaffee und frischen hausgemachten Torten und Kuchen stärken. Oder Sie lassen sich einen unserer kreativen Eisbecher am Gaumen zergehen. Den kulinarischen Höhepunkt des Tages bildet das Abendessen im Hügellandhof. Hausgemachte Pastavariationen, frische Süss- und Salzwasserfische, Rindfleischspezialitäten, saisonelle Produkte, wie z.B. Bärlauch, Spargel, Pilze, Kürbis, Wild, Martinigansl und vieles mehr machen Ihren Besuch in unserem Restaurant zu einem außergewöhnlichen Geschmackserlebnis.<br>Bei der Wahl des Weines beraten Sie unsere Servicemitarbeiter sehr gerne. Das „Verdauungs-Schnapserl“ können Sie aus einem großzügigen Angebot an erlesenen Bränden und Schnäpsen aus unserer Spirituosen-Bar wählen.<br><br><b>Öffnungszeiten</b><br>Mo-Sa 7-24 Uhr, Sonn- u. Feiertag 8-17 Uhr<br>Juni – Juli – August, Sonn- u. Feiertag 8-21 Uhr<br><br><b>Küche</b><br>Mo-Sa 10-21:30 Uhr, Sonn- u. Feiertag 9-15 Uhr<br>Juni – Juli – August, Sonn- u. Feiertag 9-21 Uhr<br><br><b>T</b>  &nbsp;<a href='tel:+4331332201'>+43 3133 – 2201</a><br><br><b>W</b> <a href='http://www.huegellandhof.eu'>www.huegellandhof.eu</a>"
	},{
		name: "Hoagascht",
		rating: 2,
		img: "img/Restaurants_Oesterreich_V01/Hoagascht",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [47.347532, 13.392086]
		},
		homepage: 'www.hoagascht.at/de/restaurant/flachau.html',
		tel: '+43645732490',
		description: "Außergewöhnliche Kreationen<br>knuspriges Entenmaki mit Waldorfsalat, gebratenes Sashimi vom Alpenlachs, Rollmops vom Saiblingsfilet, Bulgogi koreanisch, gelbes Curry mit Weisskraut, unsere berühmte Pongauer Fischsuppe im Steintopf, Tobleronemousse im Blumentopf mit schwarzer Erde,...<br><b>Hoagascht's Hochlandrind Rindfleischküche:</b><br>Carpaccio mit Kalamansi Erbsenmarinade, das Schulterscherzel HL, 18 Stunden gegart bei 78°C und unsere saftigen Aged Steaks vom Huft, Filet und Rib Eye, natürlich alles Hochlandrind! Wiener Melange - 'Traditionell gekochtes Rindfleischim Kupferkessel'.<br><br><b>Öffnungszeiten:</b><br>Mittwoch bis Montag von 11 Uhr bis 14 Uhr und 17 Uhr 30 -  21 Uhr 30<br>Dienstag Ruhetag<br><br><b>T</b>  &nbsp;<a href='tel:+43645732490'>+43645732490</a><br><br><b>W</b> <a href='http://www.hoagascht.at/de/restaurant/flachau.html'>www.hoagascht.at/de/restaurant/flachau.html</a>"
	},{
		name: "Eissalon Tödtling",
		rating: 1,
		img: "img/Restaurants_Oesterreich_V01/EissalonToedtling",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [47.455671, 15.319365]
		},
		homepage: 'www.toedtling-kapfenberg.at/eissalon.html',
		tel: '+43386231295',
		description: "Unser Eissalon bietet Ihnen eine große Auswahl von Eissorten, zu denen immer wieder neue Kreationen hinzu kommen, um Ihnen den Sommer zu versüßen.<br>Unser Sortiment reicht von Frappès verschiedener Sorten, bis hin zu leckeren Eisknödeln.Was gibt es Schöneres, als an einem heißem Sommertag unsere Eisspezialitäten zu genießen? Auch an kühlen Tagen schmecken unsere 24 täglich frischen Eissorten, aus eigener Erzeugung, ausgezeichnet. Unser Eis wird ausschließlich aus augesuchten Naturprodukten und frischen Früchten der besten Qualität erzeugt. Bei uns können sie Ihren stressigen Tag mit einer schmackhaften Eiskreation herrlich ausklingen lassen.Versuchen Sie auch unsere Eistorten und Eisknödel aus eigener Produktion!<br><br><b>T</b>  &nbsp;<a href='tel:+43386231295'>+ 43 3862 31 2 95</a><br><br><b>W</b> <a href='http://www.toedtling-kapfenberg.at/eissalon.html'>www.toedtling-kapfenberg.at/eissalon.html</a>'Unser Eissalon bietet Ihnen eine große Auswahl von Eissorten, zu denen immer wieder neue Kreationen hinzu kommen, um Ihnen den Sommer zu versüßen.<br>Unser Sortiment reicht von Frappès verschiedener Sorten, bis hin zu leckeren Eisknödeln. Was gibt es Schöneres, als an einem heißem Sommertag unsere Eisspezialitäten zu genießen? Auch an kühlen Tagen schmecken unsere 24 täglich frischen Eissorten, aus eigener Erzeugung, ausgezeichnet. Unser Eis wird ausschließlich aus augesuchten Naturprodukten und frischen Früchten der besten Qualität erzeugt. Bei uns können sie Ihren stressigen Tag mit einer schmackhaften Eiskreation herrlich ausklingen lassen.Versuchen Sie auch unsere Eistorten und Eisknödel aus eigener Produktion!<br><br><b>T</b>  &nbsp;<a href='tel:+43386231295'>+ 43 3862 31 2 95</a><br><br><b>W</b> <a href='http://www.toedtling-kapfenberg.at/eissalon.html'>www.toedtling-kapfenberg.at/eissalon.html</a>'"
	},{
		name: "Gasthaus Kollerwirt",
		rating: 5,
		img: "img/Restaurants_Oesterreich_V01/Kollerwirt",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [46.712122 , 14.342327]
		},
		homepage: 'www.kollerwirt.com',
		tel: '+4342232455',
		description: "Das traditionsreiche Gasthaus Kollerwirt liegt am Tanzenberg, hoch über dem Zollfeld. Es ist längst kein Geheimtipp mehr, sondern entwickelte sich zu einem beliebten Ausflugsort für Gourmets.<br>Die Küche ist einfach aber geschmackvoll und es wird mit regionalen Produkten gearbeitet. Hier kann man herrlich im schattigen Gastgarten mit Blick auf den Ulrichsberg oder in der rustikal eingerichteten Gaststuben verweilen. Der Kollerwirt punktet mit gutbürgerlicher Küche, von knusprigen Backhendl bis Filet-Steak, Mohntorte bis Crème Brûlée. Im Sommer wird jeden Dienstag gegrillt, Freitags gibt es frischen Fisch aus der Region.<br><br><b>Öffnungszeiten</b><br>SA, SO und Feiertag – ab 12.00 Uhr<br>MO, DO, FR – ab 17.00 Uhr<br>DI und MI – Ruhetag, außer vor einem Feiertag – ab 17.00 Uhr.<br><br>SOMMERZEIT:<br>Juli und August, täglich ab 17.00 Uhr<br>SA und SO – ab 12.00 Uhr<br>Juni und September – MI Ruhetag<br><br><b>T</b>  &nbsp;<a href='tel:+4342232455'>+43 4223/24 55</a><br><br><b>M</b>  &nbsp;<a href='tel:+436647959706'>+43 664/79 59 706</a><br><br><b>W</b> <a href='http://www.kollerwirt.com'>www.kollerwirt.com</a>"
	},{
		name: "Gasthof Tetter",
		rating: 5,
		img: "img/Restaurants_Oesterreich_V01/GasthofTetter",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [47.355901, 13.712089]
		},
		homepage: 'www.tetter.com',
		tel: '+433687215991',
		description: "Seit 1910 gibt es bereits den Gasthof Tetter und wird bereits in der 4. Generation weitergeführt.<br>„Dem Alten verpflichtet & dem Neuen aufgeschlossen“<br>Wir servieren unseren Hausgästen ein 4- gängiges Abendmenü. In unserer Küche bereiten wir alles frisch und mit ausgewählten saisonalen Produkten zu. Hausgemachte Spezialitäten, Rindfleisch aus eigener Biolandwirtschaft, vegetarische Speisen, frischer Fisch & Wild aus heimischer Region. Für unsere Gäste die unser Menü nicht in Anspruch nehmen haben wir natürlich eine kleine Karte.<br><br><b>Öffnungszeiten</b><br><br>Hotelbetrieb Sommer 2017<br>18.05 – 01.10.2017<br><br>Warme Küche<br>an Sonn und Feiertagen für a la carte Gäste<br>12.00 -  13.30<br>17.30 -  20.00<br><br>Hotelbetrieb Winter 2017/2018<br>14.12. 2017  – 02. 04. 2018<br><br>Warme Küche<br>an Sonn- und Feiertagen für a la carte Gäste<br>12.00 -  13.30<br>17.30 -  20.00<br><br><b>T</b>  &nbsp;<a href='tel:+433687215991'>+43 3687 215991</a><br><br><b>W</b> <a href='http://www.tetter.com'>www.tetter.com</a>"

	},{
		name: "Fischrestaurant Sicher",
		rating: 4,
		img: "img/Restaurants_Oesterreich_V01/FischrestaurantSicher",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [46.631897, 14.537022]
		},
		homepage: 'www.sicherrestaurant.at/',
		tel: '+4342392638',
		description: "„Die kulinarischen Luftsprünge auf dem Feld eines exakt umrissenen Angebots lassen immer wieder glauben, hier sei ein Magier am Werk.“  (Zitat Gault Millau).<br>Was Küchenchef Michael Sicher aus Saibling und Forelle, Kärntner Flusskrebsen, Kräutern und Aromen zaubert, ist stets aufs Neue bewundernswert. Auf Nummer sicher geht man auch, indem man die Weinbegleitung in die Hände von Wolfgang Sicher legt.<br><br><b>Öffnungszeiten</b><br>April – Dezember, Mi – Sa:<br>11:30 – 14:00 Uhr und 18:00 – 21:30 Uhr<br><br>weitere Öffnungszeiten:<br>Feiertags variabel geöffnet,<br>Juli und August auch am Dienstag<br><br><b>T</b>  &nbsp;<a href='tel:+4342392638'>+4342392638</a><br><br><b>W</b> <a href='http://www.sicherrestaurant.at/'>www.sicherrestaurant.at/</a>"

	},{
		name: "Gaststätte Figl",
		rating: 3,
		img: "img/Restaurants_Oesterreich_V01/GaststaetteFigl",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [48.223163, 15.666910]
		},
		homepage: 'www.gaststaettefigl.at',
		tel: '+432742257402',
		description: "Zutaten<br>„wir verwenden überwiegend Produkte aus der Region um die hohe Qualität unserer Speisen sicherstellen zu können. Selbstverständlich für uns ist, vieles selber herzustellen, wie  Marmelade, Eis & Sorbet, Nudeln, sogar den Saiblingkaviar und einiges mehr“ Peter Heneis, Küchenchef<br><br><b>Küchenzeiten</b><br>Dienstag-Samstag 11.30-14.00 und 18.00-21.30 Uhr<br>Ruhetage: Sonntag, Montag & Feiertag<br><br><b>T</b> &nbsp;<a href='tel:+432742257402'>++43 2742 / 25 74 02</a><br><br><b>W</b> <a href='http://www.gaststaettefigl.at'>www.gaststaettefigl.at</a>"
	}
];

var frankreichData = [
{
		name: "Le Calife",
		rating: 3,
		img: "img/Restaurants_Oesterreich_V01/GaststaetteFigl",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [48.857920, 2.336828]
		},
		homepage: 'www.gaststaettefigl.at',
		tel: '+432742257402',
		description: "Zutaten<br>„wir verwenden überwiegend Produkte aus der Region um die hohe Qualität unserer Speisen sicherstellen zu können. Selbstverständlich für uns ist, vieles selber herzustellen, wie  Marmelade, Eis & Sorbet, Nudeln, sogar den Saiblingkaviar und einiges mehr“ Peter Heneis, Küchenchef<br><br><b>Küchenzeiten</b><br>Dienstag-Samstag 11.30-14.00 und 18.00-21.30 Uhr<br>Ruhetage: Sonntag, Montag & Feiertag<br><br><b>T</b> &nbsp;<a href='tel:+432742257402'>++43 2742 / 25 74 02</a><br><br><b>W</b> <a href='http://www.gaststaettefigl.at'>www.gaststaettefigl.at</a>"
}, {
		name: "Seb'on",
		rating: 3,
		img: "img/Restaurants_Oesterreich_V01/FischrestaurantSicher",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [48.883637, 2.340242]
		},
		homepage: 'www.gaststaettefigl.at',
		tel: '+432742257402',
		description: "Zutaten<br>„wir verwenden überwiegend Produkte aus der Region um die hohe Qualität unserer Speisen sicherstellen zu können. Selbstverständlich für uns ist, vieles selber herzustellen, wie  Marmelade, Eis & Sorbet, Nudeln, sogar den Saiblingkaviar und einiges mehr“ Peter Heneis, Küchenchef<br><br><b>Küchenzeiten</b><br>Dienstag-Samstag 11.30-14.00 und 18.00-21.30 Uhr<br>Ruhetage: Sonntag, Montag & Feiertag<br><br><b>T</b> &nbsp;<a href='tel:+432742257402'>++43 2742 / 25 74 02</a><br><br><b>W</b> <a href='http://www.gaststaettefigl.at'>www.gaststaettefigl.at</a>"
}, {
		name: "Le Cinq",
		rating: 3,
		img: "img/Restaurants_Oesterreich_V01/GasthofTetter",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [48.868802, 2.300206]
		},
		homepage: 'www.gaststaettefigl.at',
		tel: '+432742257402',
		description: "Zutaten<br>„wir verwenden überwiegend Produkte aus der Region um die hohe Qualität unserer Speisen sicherstellen zu können. Selbstverständlich für uns ist, vieles selber herzustellen, wie  Marmelade, Eis & Sorbet, Nudeln, sogar den Saiblingkaviar und einiges mehr“ Peter Heneis, Küchenchef<br><br><b>Küchenzeiten</b><br>Dienstag-Samstag 11.30-14.00 und 18.00-21.30 Uhr<br>Ruhetage: Sonntag, Montag & Feiertag<br><br><b>T</b> &nbsp;<a href='tel:+432742257402'>++43 2742 / 25 74 02</a><br><br><b>W</b> <a href='http://www.gaststaettefigl.at'>www.gaststaettefigl.at</a>"
}, {
		name: "Boutary",
		rating: 3,
		img: "img/Restaurants_Oesterreich_V01/Kollerwirt",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [48.854907, 2.338053]
		},
		homepage: 'www.gaststaettefigl.at',
		tel: '+432742257402',
		description: "Zutaten<br>„wir verwenden überwiegend Produkte aus der Region um die hohe Qualität unserer Speisen sicherstellen zu können. Selbstverständlich für uns ist, vieles selber herzustellen, wie  Marmelade, Eis & Sorbet, Nudeln, sogar den Saiblingkaviar und einiges mehr“ Peter Heneis, Küchenchef<br><br><b>Küchenzeiten</b><br>Dienstag-Samstag 11.30-14.00 und 18.00-21.30 Uhr<br>Ruhetage: Sonntag, Montag & Feiertag<br><br><b>T</b> &nbsp;<a href='tel:+432742257402'>++43 2742 / 25 74 02</a><br><br><b>W</b> <a href='http://www.gaststaettefigl.at'>www.gaststaettefigl.at</a>"
}, {
		name: "Epicure",
		rating: 3,
		img: "img/Restaurants_Oesterreich_V01/Huegellandhof",
		distance: null,
		duration: null,
		step: {
			distance: {
				value: null,
				text: null
			},
			duration: {
				value: null,
				text: null
			}
		},
		maneuver: null,
		position: {
			type: 'Point',
			coordinates: [48.871698, 2.314661]
		},
		homepage: 'www.gaststaettefigl.at',
		tel: '+432742257402',
		description: "Zutaten<br>„wir verwenden überwiegend Produkte aus der Region um die hohe Qualität unserer Speisen sicherstellen zu können. Selbstverständlich für uns ist, vieles selber herzustellen, wie  Marmelade, Eis & Sorbet, Nudeln, sogar den Saiblingkaviar und einiges mehr“ Peter Heneis, Küchenchef<br><br><b>Küchenzeiten</b><br>Dienstag-Samstag 11.30-14.00 und 18.00-21.30 Uhr<br>Ruhetage: Sonntag, Montag & Feiertag<br><br><b>T</b> &nbsp;<a href='tel:+432742257402'>++43 2742 / 25 74 02</a><br><br><b>W</b> <a href='http://www.gaststaettefigl.at'>www.gaststaettefigl.at</a>"
}

];



//oesterreichData = require('./restaurantsOesterreich.json');
//bochumData = require('./restaurantsBochum.json');
//frankreichData = require('./restaurantsFrankreich.json');


// frankreichData = require('./restaurantsFrankreich.json');

/* request(options, function(error, response, body) {
   // myObj is accessible here and is a nice JavaScript object
   var value = myObj.someValue;

   console.log(value);
   
   // compare response identifier value with json file in node
   // if identifier value exist in the json file
   // return the corresponding value in json file instead
});

*/

/*
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('asd.txt')
});

lineReader.on('line', function (line) {
  console.log(line);
});
*/

var deg2rad = function(deg) {	
	return deg*(Math.PI/180);
};

var calculateAirDistance = function (lat1, lng1, lat2, lng2) {
	var R = 6371;
	var dLat = deg2rad(lat2-lat1);
	var dLng = deg2rad(lng2-lng1);
	
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2)+
		Math.cos(deg2rad(lat1))* Math.cos(deg2rad(lat2))*
		Math.sin(dLng/2)*Math.sin(dLng/2);
		
	var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var distance = R*c;
	
	return distance;
};

var getAllData = function() {

	return new Promise(function(resolve, reject) {
			
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			
			db.collection(collectionName).find().toArray(function(err, result) {
				
				if(result[0]) {
					resolve(result);
				}
				else {
					resolve();
					//reject();
				}
				
				db.close();
			});
		});
	});
};



app.get('/getAllData/:ownLat/:ownLng/:maxSearchDistance', function(req, res) {					// Finds and gives back every parking space in the database

	// var restaurantPos = {
		// latitude: result[i].position.coordinates[0],
		// longitude: result[i].position.coordinates[1]
	// };
	
	var ownPos = {
		latitude: req.params.ownLat,
		longitude:req.params.ownLng
	};

	getAllData().then(function(result, err) {
		if(err) {
			console.log("err");
			restoreEverything()
				.then(() => restrictListWithMaxDistance(result, ownPos, req.params.maxSearchDistance))
				.then(() => { res.send(result); });		
		}
		else {	
			
			if(result) {							
				if (result.length === 0) {
					console.log("wrong");
					restoreEverything();
					res.send();
				}
				else {	// Correct, everything worked 
					
					restrictListWithMaxDistance(result, ownPos, (req.params.maxSearchDistance/1000))
						.then(()=> { res.send(result); } );
					
				}
			}
			else {
				console.log("wrong2");
				restoreEverything();
				//res.send(0);
			}
			
		}
	});
	
	
    // MongoClient.connect(url, function(err, db) {
        // if (err) throw err;
		
		// console.log("getAllData ...");
		
        // db.collection(collectionName).find().toArray(function(err, result) {
            // if (err) throw err;
			
			// console.log(result[0]);
			
			// if(!result[0]) {
				// restoreEverything();
				
				 // db.collection(collectionName).find().toArray(function(err, result) {
					// if (err) throw err;
				
				// for (var i = result.length-1; i >= 0; i--) {
					// if(distanceIsTooLong(restaurantPos, ownPos, (req.params.maxSearchDistance/1000)) {
						// result.splice(i, 1);
					// }
				// }
				
				// res.send(result);
				 // });
			// }
			// else {
				
				// for (var i = result.length-1; i >= 0; i--) {
					// if(distanceIsTooLong(restaurantPos, ownPos, (req.params.maxSearchDistance/1000)) {
						// result.splice(i, 1);
					// }
				// }
				
				// res.send(result);
			// }
            // db.close();
        // });
    // });
});

var restrictListWithMaxDistance = function(result, ownPosition, maxDistance) {
	
	// restrictByMaxDistance(restaurantPos, ownPos, (req.params.maxSearchDistance/1000))
	return new Promise(function(resolve, reject) {
	
		for (var i = result.length-1; i >= 0; i--) {
			
			var distance = calculateAirDistance(result[i].position.coordinates[0], result[i].position.coordinates[1], ownPosition.latitude, ownPosition.longitude);
			
			if(distance > (maxDistance)) {
				result.splice(i, 1);
			}
		}
		
		resolve(result);
	})
};

app.get('/getRoutes/:lat1/:lng1/:lat2/:lng2', function(req, res) {
	
		http.get('http://localhost:5000/route/v1/driving/'+req.params.lng1+','+req.params.lat1+';'+req.params.lng2+','+req.params.lat2+'?steps=true', function(resp) {		
			
			resp.setEncoding('utf8');
			var result="";
			
			resp.on('data', function (chunk) {
			
				result += chunk;
			});
		   
		   resp.on('end', function() {
		
				result = JSON.parse(result);
						
				var highwayToDestination;

				if(result.routes) {
				
				for ( var i = 0; i < result.routes[0].legs[0].steps.length; i++) {
					
					if(result.routes[0].legs[0].steps[i].maneuver.type === 'off ramp') {
						highwayToDestination = { 
							latitude: result.routes[0].legs[0].steps[i].maneuver.location[1],
							longitude: result.routes[0].legs[0].steps[i].maneuver.location[0]
						};
						i = result.routes[0].legs[0].steps.length;
					}
				}
				
				var resultObject = {
					
					distance: result.routes[0].distance,
					duration: result.routes[0].duration,
					firstStep: result.routes[0].legs[0].steps[0].distance,
					maneuver: {
						type:		result.routes[0].legs[0].steps[0].maneuver.type,
						modifier:	result.routes[0].legs[0].steps[0].maneuver.modifier
					},
					offRampPosition: highwayToDestination
				};				
				res.send(resultObject);
				} else {
					res.end();
				}
		   });
	   });	
});

app.get('/getMapMatching/:previousPositions/:radius/:confidenceThreshold', function(req, res) {	// previousPositions => last 3 or whatever Positions
		
		
		var prePositions = JSON.parse(req.params.previousPositions);
		//console.log(prePositions.length);
		if(prePositions.length > 1)  {
		
		var ref1 = 'http://localhost:5000/match/v1/driving/';
		var ref = '';
		var afterwardsString = '?radiuses=';
		
		for (i = prePositions.length - 1; i >= 0; i--) {
		
			ref += prePositions[i].longitude;
			ref += ',';
			ref += prePositions[i].latitude;
			
			afterwardsString += req.params.radius + '';
			
			if(i != 0) {
				ref += ';';
				afterwardsString += ';';
			}
		}

		//ref += afterwardsString;
		
		var ref3 = ref1 + ref + afterwardsString;
		
		
		
		
		//console.log(ref);
		
		/*
		6.963610,51.442471
		6.964335,51.442688
		*/
		//ref = "http://localhost:5000/match/v1/driving/6.963610,51.442471;6.964335,51.442688?radiuses=20;20";
		
		//http.get("http://localhost:5000/match/v1/driving/6.963610,51.442471;6.964335,51.442688?radiuses=20;20", function(resp) {	
		http.get(ref3, function(resp) {		
			
			resp.setEncoding('utf8');
			var result="";
			
			resp.on('data', function (chunk) {
				result += chunk;
			});
		   
		   resp.on('end', function() {
				
				result = JSON.parse(result);
				
				if(result.matchings && result.tracepoints[result.tracepoints.length-1]) {	//  && result.tracepoints
				
					var resultObject = {
						confidence: result.matchings[0].confidence,
						latitude: result.tracepoints[result.tracepoints.length-1].location[1],
						longitude: result.tracepoints[result.tracepoints.length-1].location[0]	
					};		
					
					console.log(ref + " / " + resultObject.latitude + " " + resultObject.longitude + " " + resultObject.confidence);
					
					res.send(resultObject);
				} else {
					console.log("nothing found");
					res.end();
				}
		   });
	   });	
	   
	    } else {
			res.end();
		}
});
 
app.get('/createDB/', function(req, res) {

	createDatabase();
	console.log("DB Created");

	res.end();
});

app.get('/restoreAllData/', function(req, res) {

	restoreEverything();
	res.end();
	//res.send(JSON.stringify(ret));

});

var restoreEverything = function() {

	console.log("restore");

	return new Promise(function(resolve, reject) {

		MongoClient.connect(url, function(err, db) {
			if(err) throw err;
				
				for(var i = 0; i < oesterreichData.length; i++) {
						db.collection(collectionName).insertOne(oesterreichData[i], function () {		
						});
				}
				for(var i = 0; i < bochumData.length; i++) {
						db.collection(collectionName).insertOne(bochumData[i], function () {		
						});
				}
				for(var i = 0; i < frankreichData.length; i++) {
						db.collection(collectionName).insertOne(frankreichData[i], function () {		
						});
				}
				resolve();
				db.close();
		});
	});
};

	// MongoClient.connect(url, function(err, db) {
		// if(err) throw err;
			
			// for(var i = 0; i < oesterreichData.length; i++) {
					// db.collection(collectionName).insertOne(oesterreichData[i], function () {		
					// });
			// }
			// for(var i = 0; i < bochumData.length; i++) {
					// db.collection(collectionName).insertOne(bochumData[i], function () {		
					// });
			// }
	// });

// };

createDatabase = function() {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");

    db.collection(collectionName).createIndex( {position : "2dsphere" });

    db.createCollection(collectionName, function(err, res) {
      if(err) throw err;
      db.close();
    });
  });
};

insertData = function(parkdingSpace) {

	    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
            db.collection(collectionName).insertOne(parkdingSpace, function () {  // EINFÜGEN
                console.log("Data inserted");
            });
    });
};

insertTempData = function(parkdingSpace) {

	    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
            db.collection(collectionName2).insertOne(parkdingSpace, function () {  // EINFÜGEN
                console.log("Data inserted");
            });
    });
};

deleteById = function(thisId) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

		console.log("Delete data");

         db.collection(collectionName).deleteOne({"_id": ObjectId(thisId)});

		 console.log("fourth");

        db.close();
    });
}

sortByDistance = function(latitude, longitude, maxDistance) {			// sorts all parking Spaces in the Database by Distance compared with the current Position of the User

	var orderedList;

    (function (callback) {MongoClient.connect(url, function(err, db) {
        if (err) throw err;

			db.collection(collectionName).find(
			   {
				 position: {
					$nearSphere: {
					   $geometry: {
						  type : "Point",
						  coordinates : [ parseFloat(latitude), parseFloat(longitude)],
					   },
					   $minDistance: 0,
					   $maxDistance: parseFloat(maxDistance)
					  }
				  }
			   }
			).toArray( function (err, result) {

				orderedList = result;
				if(callback) callback();
			});

        db.close();
    });

	}(function () {
		removeCollection(collectionName2);			// CollectionName2 is tempData that is limited
		insertAll(orderedList, collectionName2);
	}));
};

insertAll = function (array, coll) {

	    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection(coll).insert(array);

		console.log("Insert into: "+coll);

        db.close();
    });
};

removeCollection = function(name) {					// removes all parking Spaces from the Database
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

		console.log("RemoveCollection: "+name);
        db.collection(name).remove();

        db.close();
    });
}

app.post('/sortByDistance/:latitude/:longitude/:maxDistance', function(req, res) {	// LÖSCHEN !

	console.log("SortByDistance")
	sortByDistance(req.params.latitude, req.params.longitude, req.params.maxDistance);

	res.end();
	//res.send(JSON.stringify(ret));

});

app.get('/test/', function(req, res) {	// LÖSCHEN !

	var x = 'Hallo1';
	console.log("test1");
	
	removeCollection(collectionName);
	
	res.end(x);
});

app.get('/test2/', function(req, res) {	// LÖSCHEN !

	var x = 'Hallo2';
	console.log("test2");
	
	//removeCollection(collectionName);
	
	res.end(x);
});

app.get('/showAllData', function (req, res) {
	    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
		
        db.collection(collectionName).find().toArray(function(err, result) {
            if (err) throw err;
			
			res.send(result);
			
            db.close();
        });
    });
});

app.get('/getAllData', function(req, res) {					// Finds and gives back every parking space in the database, if there is no data, insert everything in again

	console.log("getAllData");

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
		
        db.collection(collectionName).find().toArray(function(err, result) {
            if (err) throw err;		
			
			//console.log(result);
			if(result) {							
				if (result.length === 0) {
					console.log("wrong");
					restoreEverything()
					.then(function () {
						//res.send(getAllData());
						//http.get('http://localhost:8000/test2/');
						console.log("second");
					});
				}
				else {
					res.send(result);
				}
			}
			else {
				restoreEverything()
				.then(function () {
					//res.send(getAllData());
					console.log("second");
				});
			}

			res.send();
			
            db.close();
        });
    });
});

app.get('/getTempData', function(req, res) {				// Finds and gives back all restaurants that are near the user (maximum Distance is controlled by an input of the user)

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection(collectionName2).find().toArray(function(err, result) {
            if (err) throw err;

            res.send(result);

            db.close();
        });
    });
});

app.get('/getInput/', function(req, res) {		// WEG ???

	res.send(JSON.stringify(obj));
});

app.post('/insert', function(req, res) { 		// !!!

	insertData(req.body);
	res.end();

});

app.post('/insertTemp', function(req, res) { 		// !!!

	insertTempData(req.body);

	res.end();

});

// app.get('/test2/', function(req, res) {		// WEG ???

	// p1()
	// .then((resolve, reject) => {p2(resolve) } )
	// .then(function(resolve, reject) {
		// console.log("hallo");
	// });
	
	
	// p1().then(resolve, reject) {
		
		
	// };
	
	
// });

// var p1 = function() {
	
	// return new Promise(function(resolve, reject) {
		// MongoClient.connect(url, function(err, db) {
			// if (err) throw err;

			// db.collection(collectionName).findOne({name: 'Wirtshaus Jagawirt'},(function(err, result) {
				// if (err) throw err;
				
					// //console.log(result);
				// resolve(result);
				// db.close();
			// }));
		// });
	// });
// };

// var p2 = function(a) {
	// console.log(a);
	// return new Promise(function(resolve, reject) {
		
		// MongoClient.connect(url, function(err, db) {
			// if (err) throw err;

			// db.collection(collectionName).find().toArray(function(err, result) {
				// if (err) throw err;
					// //console.log(result);
				// resolve(result);
				// db.close();
			// });
		// });
	// });
// };


app.delete('/deleteById/:id', function (req, res) {

    deleteById(req.params.id);
});

app.delete('/deleteAll', function (req, res) {
    removeCollection(collectionName);		// !!!
	console.log("delete All");
	res.send("Delete");
});

app.listen(8000);
