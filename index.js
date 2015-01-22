(function(Tabletop, jQuery){

  /**
   * gff App object
   */
  var gff = gff || {};

  /**
   * Config parameters
   * @type {Object}
   */
  gff.config = {
    "categories":             window.categories,
    "questions":              [],
    "userDataRow":            '',
    "userDriveUrl":           'https://docs.google.com/spreadsheets/d/1v7h_RER151mqmJiA03hrGo9UhycYI058Ct-xSXM9-4I/pubhtml?gid=0&single=true',
    "filterColumnName":       'Selection',
    "filterColumnDelimiter":  ',',          // Graffiti, Photography
    "userColumnName":         'Email',
    "userParamName":          'email',      // ?email='rememberlenny@gmail.com'
    "questionWrapper":        'ol.ss-question-list',
    "questionSelectors":      'ol div.ss-form-question',
  };

  /**
   * First function to run
   */
  gff.initialize = function(){
    gff.getGoogleForm()
  }

  gff.getGoogleForm = function(){
    $.ajaxPrefilter(function(options) {
      if(options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        //options.url = "http://cors.corsproxy.io/url=" + options.url;
      }
    });

    $.get(
      window.form,
      function(response) {
          console.log(response);
          window.red = response;
          // $("body").html(response);
          gff.kickOff();
      }
    );
  }

  /**
   * Callback after Drive data is accessed
   */
  gff.kickOff = function(){
    console.log('Kick off running');
    gff.config.categories = window.categories;
    gff.config.userValue = gff.getUserFieldFromUrl();
    gff.assignUserField();
    gff.getUsersRow();
    gff.identiyFilters();
  }

  /**
   * Use TableTop to get Drive data
   */
  gff.getDriveData = function(){
    var tableTopConfig = {
      key: gff.config.userDriveUrl,
      callback: gff.saveDriveData,
      simpleSheet: true
    }
    Tabletop.init( tableTopConfig );
  }

  /**
   * Trigger for app and saves Drive data
   */
  gff.saveDriveData = function(data, tabletop){
    gff.config.driveData = data;
    gff.kickOff();
    console.log(data);
  }

  /**
   * Parse spreadsheet data to find User's data
   */
  gff.getUsersRow = function(){
    for(i = 0; i < gff.config.driveData.length; i++){
      if(gff.config.driveData[i][gff.config.userColumnName] == gff.config.userValue){
        gff.config.userDataRow = gff.config.driveData[i];
      }
    }
  }

  /**
   * Identify the filters in the filterColumn field
   */
  gff.identiyFilters = function(){
    var filterColumn = gff.config.filterColumnName;
    var delimiter = gff.config.filterColumnDelimiter;
    var filterColumnValue = gff.config.userDataRow[filterColumn];
    var filterValues = filterColumnValue.split(delimiter);
    gff.trimFilterValues(filterValues);
  }

  /**
   * Trim the filter values
   * @param  {[array]} values list of filtered
   */
  gff.trimFilterValues = function(values){
    var filterValues = [];
    for(i = 0; i < values.length; i++){
      values[i] = values[i].trim();
      filterValues = filterValues.push(values[i]);
    }
    gff.idenityQuestionSlots(filterValues);
  }


  gff.idenityQuestionSlots = function(filterValues){
    var slots = [];
    config.filterValues
    for(i = 0; i < gff.config.categories.length; i++){
      if (gff.config.categories[i] == filterValues){
        slots = slots.concat(filterValues[gff.config.categories[i]]);
      }
    }
    gff.displayQuestions(slots);
  }

  /**
   * Store all the questions on form in data
   */
  gff.getAllQuestions = function(){
    gff.config.questions = document.querySelectorAll(gff.config.questionSelectors);
  }

  /**
   * Get the user value from URL
   */
  gff.getUserFieldFromUrl = function(){
    var paramValue = gff.getParameterByName(gff.config.userParamName);
    gff.config.userValue = paramValue;
  }

  /**
   * Applies user value to last slot field
   */
  gff.assignUserField = function(){
    var userSlot = gff.config.questions[gff.config.questions.length - 1];
    var userField = userSlot.querySelector('input');
    userField.value = gff.config.userValue;
  }

  /**
   * Get the query parameters in the URL
   * @param  {[string]} name Param key
   * @return {[string]}      Param value
   */
  gff.getParameterByName = function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  /**
   * Display the questions that are sloted
   * @param  {[array]} acceptedArray list of visible questions
   *
   * This is given an array of slots that should be visible.
   */
  gff.displayQuestions = function(acceptedArray){
    for (i = 0; i < questions.length; i++){
      for (j = 0; j < acceptedArray.length; j++){
        if (acceptedArray[j] == i){
          var el = questions[i];
          el.classList.add('visible');
        }
      }
    }
  }

  gff.initialize();

})(Tabletop, jQuery);
