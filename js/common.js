chainedQuiz = {};
chainedQuiz.points = 0; // initialize the points as 0
chainedQuiz.questions_answered = 0;

chainedQuiz.goon = function(quizID, url) {
	// make sure there is answer selected
	var qType = jQuery('#chained-quiz-form-' + quizID + ' input[name=question_type]').val();	
	var chkClass = 'chained-quiz-' + qType;
	jQuery('#chained-quiz-action-' + quizID).attr('disabled', true);
	
	// is any checked?
	var anyChecked = false;
	jQuery('#chained-quiz-form-' + quizID + ' .' + chkClass).each(function(){
		if(this.checked) anyChecked = true; 	
	});
	
	if(!anyChecked && (qType != 'text')) {
		alert(chained_i18n.please_answer);
		jQuery('#chained-quiz-action-' + quizID).removeAttr('disabled');
		return false;
	}

  if(qType == 'text' && jQuery('#chained-quiz-form-' + quizID + ' textarea[name=answer]').val() == '') {
  		alert(chained_i18n.please_answer);
  		jQuery('#chained-quiz-action-' + quizID).removeAttr('disabled');
		return false;
  }
	
	// submit the answer by ajax
	data = jQuery('#chained-quiz-form-'+quizID).serialize();
	data += '&action=chainedquiz_ajax';
	data += '&chainedquiz_action=answer';
	this.questions_answered++;
	data += '&total_questions=' + this.questions_answered;
	
	// console.log(data);
	jQuery.post(url, data, function(msg) {
		  parts = msg.split("|CHAINEDQUIZ|");
		  points = parseFloat(parts[0]);		  
		  chainedQuiz.points += points;		  

			if(jQuery('body').scrollTop() > 250) {				
				jQuery('html, body').animate({
			   		scrollTop: jQuery('#chained-quiz-wrap-'+quizID).offset().top -100
			   }, 500);   
			}		  
			
		  jQuery('#chained-quiz-action-' + quizID).removeAttr('disabled');
		  
		  jQuery('#chained-quiz-div-'+quizID).html(parts[1]);
		  jQuery('#chained-quiz-form-' + quizID + ' input[name=points]').val(chainedQuiz.points);
	});
}