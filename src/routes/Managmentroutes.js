const express = require('express');
const Managment = express.Router();
const IndustriesData = require("../controllers/Managment/industries")
const CityData = require("../controllers/Managment/Citycontoller")
const CountryData = require("../controllers/Managment/countrycntoller")
const StateData = require("../controllers/Managment/Statecontroller")
const languageData = require("../controllers/Managment/languagecontoller")
const LevelData = require("../controllers/Managment/LevelContoller") 
const PlateFormData = require("../controllers/Managment/PlateFormcontroller")

// industries
Managment.get('/get-all-industries', IndustriesData.getAllIndustries);
Managment.post('/create-industries', IndustriesData.createIndustries);
Managment.put('/update-industries/:id', IndustriesData.updateIndustries);
Managment.delete('/delete-industries/:id', IndustriesData.deleteIndustries);
Managment.get('/get-industries-by-id/:id', IndustriesData.getIndustriesById);

// language
Managment.get('/get-all-languages', languageData.getAllLanguages);
Managment.post('/create-language', languageData.createLanguage);
Managment.put('/update-language/:id', languageData.updateLanguage);
Managment.delete('/delete-language/:id', languageData.deleteLanguage);
Managment.get('/get-language-by-id/:id', languageData.getLanguageById);

// level
Managment.get('/get-all-levels', LevelData.getAllLevels);
Managment.post('/create-level', LevelData.createLevel);
Managment.put('/update-level/:id', LevelData.updateLevel);
Managment.delete('/delete-level/:id', LevelData.deleteLevel);
Managment.get('/get-level-by-id/:id', LevelData.getLevelById);

// PlateFormcontroller
Managment.get('/get-all-platforms', PlateFormData.getAllPlatform);
Managment.post('/create-platform', PlateFormData.createPlatform);
Managment.put('/update-platform/:id', PlateFormData.updatePlatform);
Managment.delete('/delete-platform/:id', PlateFormData.deletePlatform);
Managment.get('/get-platform-by-id/:id', PlateFormData.getPlatformById);

 

// country
Managment.get('/get-all-countries', CountryData.getAllCountries);
Managment.post('/create-country', CountryData.createCountry);
Managment.put('/update-country/:id', CountryData.updateCountry);
Managment.delete('/delete-country/:id', CountryData.deleteCountry);
Managment.get('/get-country-by-id/:id', CountryData.getCountryById);

// state
Managment.get('/get-all-states', StateData.getAllStateByCountryId);
Managment.post('/create-state', StateData.createState);
Managment.put('/update-state/:id', StateData.updateState);
Managment.delete('/delete-state/:id', StateData.deleteState);

// city
Managment.get('/get-all-cities', CityData.getAllCities);
Managment.post('/create-city', CityData.createCity);
Managment.put('/update-city/:id', CityData.updateCity);
Managment.delete('/delete-city/:id', CityData.deleteCity);
Managment.get('/get-city-by-id/:id', CityData.getCityById);

module.exports = Managment;
