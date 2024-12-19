class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Search
  search() {
    const user_name = this.queryStr.name
      ? {
        user_name: {
            $regex: this.queryStr.name,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...user_name });
    return this;
  }

  
  paginate(perPage) {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || perPage;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
 
  // Filter by status
  filterByverification() {
    const verification = this.queryStr.verification ? { verification: this.queryStr.verification } : {};
    this.query = this.query.find({ ...verification });
    return this;
  }

  // Filter by level
  filterByLevel() {
    const level = this.queryStr.level ? { level: this.queryStr.level } : {};
    this.query = this.query.find({ ...level });
    return this;
  }
  filterByMultiLevel() {
    // Convert the level string into an array of numbers
    const levels = this.queryStr.MultiLevels ? this.queryStr.MultiLevels.split(',').map(Number) : [];
  
    // If the levels array is not empty, filter by the levels
    if (levels.length > 0) {
      this.query = this.query.find({ level: { $in: levels } });
    }
  
    return this;
  }
  

  // Filter by verification
  filterByVerification() {
    const verification = this.queryStr.verification ? { verification: this.queryStr.verification } : {};
    this.query = this.query.find({ ...verification });
    return this;
  }

  // filter by gender
  filterByGender() {
    const gender = this.queryStr.gender ? { gender: this.queryStr.gender } : {};
    this.query = this.query.find({ ...gender });
    return this;
  }
  filterById() {
      const id = this.queryStr.id
      ? {
        id: {
            $regex: this.queryStr.id,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...id });
    return this;
  }
  filterByPhone() {
    const phone = this.queryStr.phone
      ? {
        mobile: {
          $regex: this.queryStr.phone,
          $options: "i",
        },
      }
      : {};
    this.query = this.query.find({ ...phone });
    return this;
  }
  

  
  // filter by primary_platform
  filterByPrimaryPlatform() {
    const primary_platform = this.queryStr.primary_platform
      ? { primary_platform: this.queryStr.primary_platform }
      : {};
    this.query = this.query.find({ ...primary_platform });
    return this;
  }

  // filter by ship_country
  filterByCountry() {
    const ship_country = this.queryStr.ship_country
      ? { ship_country: this.queryStr.ship_country }
      : {};
    this.query = this.query.find({ ...ship_country });
    return this;
  }
  // filter by ship_state
  filterByState() {
    const ship_state = this.queryStr.ship_state
      ? { ship_state: this.queryStr.ship_state }
      : {};
    this.query = this.query.find({ ...ship_state });
    return this;
  }
  // filter by ship_city
  filterByCity() {
    const ship_city = this.queryStr.ship_city
      ? { ship_city: this.queryStr.ship_city }
      : {};
    this.query = this.query.find({ ...ship_city });
    return this;
  }
  
  // filterByLanguage() {
  //   const language = this.queryStr.language
  //     ? { language: { $regex: this.queryStr.language, $options: "i" } }
  //     : {};
  //   this.query = this.query.find({ ...language });
  //   return this;
  // }
  
  // Add this method to filter by industry
  // filterByIndustry() {
  //   const industry = this.queryStr.industry
  //     ? { industry: { $regex: this.queryStr.industry, $options: "i" } }
  //     : {};
  //   this.query = this.query.find({ ...industry });
  //   return this;
  // }


  // Add this method to the ApiFeatures class
filterByIndustry() {
  if (this.queryStr.industry) {
    const industries = this.queryStr.industry.split(',').map(ind => ind.trim());
    const regexArray = industries.map(ind => new RegExp(`\\b${ind}\\b`, 'i'));
    this.query = this.query.find({ industry: { $all: regexArray } });
  }
  return this;
}

  // Sort by ID in descending order
  sortByIdDesc() {
    this.query = this.query.sort({ id: -1 });
    return this;
  }
  // Sort by registration date in descending order
sortByRegDateDesc() {
  this.query = this.query.sort({ regs_date: -1 });
  return this;
}


// same for language
filterByLanguage() {
  if (this.queryStr.language) {
    const languages = this.queryStr.language.split(',').map(lang => lang.trim());
    const regexArray = languages.map(lang => new RegExp(`\\b${lang}\\b`, 'i'));
    this.query = this.query.find({ language: { $all: regexArray } });
  }
  return this;
}
 

  
  getFilter() {
    return this.query.getFilter();
  }
}

module.exports = ApiFeatures;
