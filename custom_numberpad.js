/*global LearnosityAmd*/
LearnosityAmd.define(['jquery-v1.10.2'], function ($) {
    'use strict';
    //function to build up HTML table and add onclick handlers
    function buildHtmlAndInteractions(init, lrnUtils) {

        var $htmlObj;
        //
        //Learnosity Tech Test: Complete here
        //
        //Build up the structure you want to use here, and add any event handling you may want to use
        //Set structure for number pad and output
        $htmlObj = $('<div></div>').addClass('grid-container');
        $htmlObj.append('<output></output>');
        $htmlObj.find('output').attr('id', 'question_input').attr('type', 'text');
        $htmlObj.find('output').append('<div></div>');
        $htmlObj.find('div').addClass('inner-grid-container');
        for (var i = 0; i < 3; ++i) {
            $htmlObj.find('.inner-grid-container').append('<div></div>');
            $htmlObj.find('.inner-grid-container').find('div').addClass('output');
            $htmlObj.find('.output').attr('id', function(i) {
                if (i === 0) { return 'firstVal'; }
                else if (i === 1) { return 'secondVal';}
                else { return 'thirdVal'; }
            });
        }
        for (var row = 0; row < 10; ++row) {
            for (var col = 0; col < 3; ++col) {
                $htmlObj.filter('.grid-container').append('<button></button>');
                $htmlObj.find('button').last().addClass('col').addClass('col'+(col+1)).attr('value', row).text(row);
            }
        }

        
        //return either as JQuery Element or String of HTML
        return $htmlObj;
    }

    //function to change UI based on correct or incorrect answer status
    function addValidationUI(questionAnswerStatus) {
        //
        //Learnosity Tech Test: Set solution to indicate whether solution is valid or invalid
        //
        var inputField = $('#question_input');
        inputField.removeClass('invalid valid');
        if (questionAnswerStatus == false) {
            inputField.addClass('invalid');
        } else {
            inputField.addClass('valid');
        }
       
    }

    //Learnosity:
    //Demo framework for custom question starts here. 
    //You don't have to change anything, except for the "isValid() function and the DOM element (#question_input) storing response
    //but you can if you see something useful.

    function CustomNumberPad(init, lrnUtils) {

        //create example table and button elements for constructing numberpad.
        var $questionTypeHtml = buildHtmlAndInteractions(init);
        this.$el = init.$el;
        
        // add Check Answer button
        init.$el.html($questionTypeHtml);
        init.$el.append('<div data-lrn-component="checkAnswer"/>');
        lrnUtils.renderComponent('CheckAnswerButton', this.$el.find('[data-lrn-component="checkAnswer"]').get(0));
        
        //Sense trigger from Check Answer button
        this.$el.find('[data-lrn-component="checkAnswer"]').click(function () { 
            init.events.trigger('changed', $(this).val()); 
        });

        //add on validate
        init.events.on('validate', function () {
            init.response = $('#question_input').val();
            // Create scorer
            var scorer = new CustomNumberPadScorer(init.question, init.response);
            //check if answer is correct, and pass true or false to the function to update validation UI
            addValidationUI(scorer.isValid());
        });

        //set val to empty for all variables
        var $valOutput, $firstVal= "", $secondVal= "", $thirdVal = "";

        //Listen to when button is trigger and push value of button into corresponding column
        $('button').click(function() {
            //Remove indicaiton of whether soluation invalid/valid because user is changing answer
            $('#question_input').removeClass('invalid valid');
            //indentify which column user is inputing from, update appear of button, and grab value
            if($(this).hasClass('col1')) {
                //grab value from first col
                $firstVal = $(this).attr('value');
                //remove 'clicked' class that hold selected attr from all button in col1
                $('.col1').removeClass('clicked');
                //set class to the button to update attribute found in custom_numberpad.css
                $(this).addClass('clicked');
            }
            else if($(this).hasClass('col2')) {
                //grab value from second col
                $secondVal = $(this).attr('value');
                //remove 'clicked' class that hold selected attr from all button in col2
                $('.col2').removeClass('clicked');
                //set class to the button to update attribute found in custom_numberpad.css
                $(this).addClass('clicked');
            }
            else if($(this).hasClass('col3')) {
                //grab value from third col
                $thirdVal = $(this).attr('value');
                //remove 'clicked' class that hold selected attr from all button in col3
                $('.col3').removeClass('clicked');
                //set class to the button to update attribute found in custom_numberpad.css
                $(this).addClass('clicked');
            }

            //update the divs to output value of button just pressed to corresponding column
            $('#firstVal').html($firstVal);
            $('#secondVal').html($secondVal);
            $('#thirdVal').html($thirdVal);
            
            //combine the values to be stored into #question_input value
            $valOutput= $firstVal + $secondVal + $thirdVal;
            $('#question_input').attr('value', $valOutput);
        });

        //tell "host API" that this question is ready
        init.events.trigger('ready');
    }

    //set question and response
    function CustomNumberPadScorer(question, response) {
        this.question = question;
        this.response = response;
    }

    //check if answer is valid
    CustomNumberPadScorer.prototype.isValid = function () {
        //
        //Learnosity Tech Test: Complete here
        //
        return $('#question_input').val() === this.question.valid_response;
    };
    
    //score
    CustomNumberPadScorer.prototype.score = function () {
        return this.isValid() ? this.maxScore() : 0;
    };

    //max score
    CustomNumberPadScorer.prototype.maxScore = function () {
        return this.question.score || 1;
    };

    //check if a valid response was set so validation can proceed
    CustomNumberPadScorer.prototype.canValidateResponse = function () {
        return !!this.question.valid_response;
    };

    //return custom question and scoring hook to "host API"
    return {
        Question: CustomNumberPad,
        Scorer: CustomNumberPadScorer
    };
});

