var  inputUsers = $("#inputUsers").val(); 
var  contractLength = $("#contractLengthDisplay").val();
var updateCalc = false;
var updateCalc2 = true;
userChange = false;



$(function() { 
 
    //User Input & Contract Length
    
    var totalPerMonthDisplay = $("#totalPricePerMonthDisplay"); 
    var totalPerYearDisplay = $("#totalPricePerYearDisplay");
    
    //Initial Output Display
    totalPerMonthDisplay.html("Enter a Number");
    totalPerYearDisplay.html("Enter a Number");
    
    //Variables
        
    //Global Discount Constants ============================================================================================
    
    var globalDiscount;
        
    //Subscription Model Constants ============================================================================================
    var basicRatio = 1; 
    var advancedRatio = 10;  
    var superRatio = 20;  
    
    var basicLicenseRate = 40;
    var advancedLicenseRate = 60;
    var superLicenseRate = 90;
    
    var basicBasicPackage = 17;
    var advancedBasicPackage = 2;
    var superBasicPackage = 1;
    var baseRate = 1000;
    
    
                //SUBSCRIPTION DISCOUNT CONSTANTS =========================================================================
    
                var maxBucket = [];
                var licensesInTier = [];
                var eqSubLicenses = [];
    
                var maxUser = [20, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 20000, 40000, 100000];
                var subDiscount = [0, .05, .10, .15, .25, .344, .474, .60, .704, .780, .829, .900];
    
                var totalLicensesInTier;
                var totalEqLicenses;
               
                var bucket0 = 20;
                var bucket1 = 30;
                var bucket2 = 50;
                var bucket3 = 150;
                var bucket4 = 250;
                var bucket5 = 500;
                var bucket6 = 1500;
                var bucket7 = 2500;
                var bucket8 = 5000;
                var bucket9 = 10000;
                var bucket10 = 20000;
                var bucket11 = 60000;
    
                


    //Services Model Constants ============================================================================================
    
    var onSiteRatePerDay = 1200;
    var ratioDays = 50;
    var proServiceRate = 200;
    var timeWidget = 6;
    var ratioWidget = 20;
    
        //Silver Tier Constants
    var silverDiscount = .20;
    var silverDollarsPerMonth = 1000;
    
        //Gold Tier Constants
    var goldDiscount = .30;
    var goldDollarsPerMonth = 2000;
    
        //Platinum Tier Constants
    var platinumDiscount = .40;
    var platinumDollarsPerMonth = 4000;
    
        //Platinum-Plus Tier Constants
    var platinumPlusDiscount = .50;
    var platinumPlusDollarsPerMonth = 8000;
    
    //Hardware Model Constants ============================================================================================
    
    var ipadCost = 400;
    var ipadLabor = ipadCost * .150;
    var ipadCaseCost = 50;
    var ipadCaseLabor = ipadCaseCost * .150;
    //var ipadTotalPerMonth = (ipadCost + ipadLabor + ipadCaseCost + ipadCaseLabor)/contractLength; 
       
    var markupPerMonth = .01;
    var insurancePerMonth = .03;
    var userToIpadRatio = 10;
    var managedSolution = 5;
    

    //Check if user entered a value for # of users, then update total price before slide
      
    $("#inputUsers").change(function(){
        
        userChange = true;
        
        if($(this).val() <= 0){
            
            totalPerMonthDisplay.html("Enter a Number");
            totalPerYearDisplay.html("Enter a Number");
            updateCalc2 = false;
            userChange = false;
            
        }
        
        else { 
        //Set current input users
            
            inputUsers = $(this).val();
            contractLength = $("#contractLengthDisplay").val();
            updateCalc = true; 
            updateCalc2 = true;
            
        }
        
         });
    
     //Slider ============================================================================================
 
        $("#slider")
          .slider(
        {
      range: "max",
      min: 12,
      max: 48,
      step: 12,        
      slide: function(event, ui) {
          
 
    //Change values of slides   
        $("#contractLengthDisplay").val(ui.value);
                   
    $("#contractLengthDisplay").on("change", function (){
        
        if(userChange == false){
            updateCalc2 = false;
            totalPerMonthDisplay.html("Enter a Number");
            totalPerYearDisplay.html("Enter a Number");
            
        }
         
        else {
        contractLength = $(this).val();
        updateCalc = true; 
        updateCalc2 = true;
            
        }
      
    });
          
          $("#contractLengthDisplay").trigger("change"); //notify listener

            } 
        });

     
    setInterval (function (){
    
        if(updateCalc == true && updateCalc2 == true){
    
            //Calculate Total from Subscription component  ============================================================================================
        
        //Calculate Licenses Included at Each Tier
          
          var basicLicensesIncluded = calculateBasicLicensesIncluded(inputUsers);
          var advancedLicensesIncluded = calculateAdvancedLicensesIncluded(inputUsers);
          var superLicensesIncluded = calculateSuperLicensesIncluded(inputUsers);
                 
            //Calculate Total Licenses at Each Tier
          
          var totalLicensesBasic = calculateTotalBasicLicenses(inputUsers, advancedLicensesIncluded, superLicensesIncluded);
          var totalLicensesAdvanced = calculateTotalAdvancedLicenses(advancedLicensesIncluded);
          var totalLicensesSuper = calculateTotalSuperLicenses(superLicensesIncluded);
          
          
          //Calculate Subtotal Price at Each Tier
          
          var basicSubtotal = calculateBasicSubtotal(totalLicensesBasic, basicBasicPackage, basicLicenseRate);
          var advancedSubtotal = calculateAdvancedSubtotal(totalLicensesAdvanced, advancedBasicPackage, advancedLicenseRate);
          var superSubtotal = calculateSuperSubtotal(totalLicensesSuper, superBasicPackage, superLicenseRate);
          
          
          //Calculate Total (Per Month) and (Per Year) Before Discount
          
          var licenseTotalPerMonthBeforeDiscount = calculateTotalPerMonthBeforeDiscount(basicSubtotal, advancedSubtotal, superSubtotal) + baseRate;
          
            //Calculate subscription discount
            
          var totalSubDiscount = licenseTotalPerMonthBeforeDiscount *  subDiscountCalc();
            
           var subscriptionTotalPerMonth = licenseTotalPerMonthBeforeDiscount - totalSubDiscount;
              
    //Calculate Total From Service Component  ============================================================================================
        
         var recommendedTier = tierFinder(inputUsers);
         var daysOnSitePerMonth = daysOnSiteCalc(inputUsers);
         var daySubTotalPerMonth = daySubTotalPerMonthCalc(daysOnSitePerMonth);
         var serviceHoursPerMonth = serviceHoursCalc(inputUsers);
         
        var serviceSubTotalPerMonth = serviceSubtotalPerMonthCalc(serviceHoursPerMonth);
         
         var tierSubTotal = tierSubTotalCalc(recommendedTier);
         var monthlyPlanSubtotal = servicePlanSubTotalPerMonthCalc(tierSubTotal, daySubTotalPerMonth, serviceSubTotalPerMonth);   
         var monthlyServiceTotal = servicePlanTotalPerMonthCalc(recommendedTier, tierSubTotal, daySubTotalPerMonth, serviceSubTotalPerMonth);
        
         var serviceTotalPerMonthBeforeDiscount = daySubTotalPerMonth + serviceSubTotalPerMonth; 
                             
    
    
    //Calculate Total From Hardware Component  ============================================================================================ 
        
        var currentBaseHardwarePrice = ipadTotalPerMonth();
        var totalMarkupPrice = totalMarkupBreakdown();
        var totalInsurancePrice = insuranceBreakdown();
        
        var subTotalPerUnit = subTotalPerMonth();
        var currentIpadQuantity = ipadQuantity(inputUsers);      
        var hardwareTotalPerMonth = totalHardwareCost(subTotalPerUnit, currentIpadQuantity);
             
        
    //Calculate Subtotal of all three components  ============================================================================================ 
        
       
            
        var globalSubTotalNoDiscount = serviceTotalPerMonthBeforeDiscount + hardwareTotalPerMonth + subscriptionTotalPerMonth;
        var calculatedGlobalDiscountPerMonth = globalSubTotalNoDiscount * globalDiscountCalc();    //Global Discount
   
        //============
            
        
        var globalSubTotalPerYearNoDiscount = (serviceTotalPerMonthBeforeDiscount + hardwareTotalPerMonth + subscriptionTotalPerMonth) * 12;
        var calculatedGlobalDiscountPerYear = globalSubTotalPerYearNoDiscount * globalDiscountCalc(); 
        
        //Total Per Month/Year 
        
        var globalTotalPerMonth = Math.round(globalSubTotalNoDiscount - calculatedGlobalDiscountPerMonth);
            
        var globalTotalPerYear = Math.round(globalSubTotalPerYearNoDiscount - calculatedGlobalDiscountPerYear);    
            
        var globalTotalFormatted = numberWithCommas(globalTotalPerMonth); //Format Number to use commas   
            
        var globalTotalPerYearFormatted = numberWithCommas(globalTotalPerYear);
            
            if(inputUsers == 0){
                
                
            }
            
            
        totalPerMonthDisplay.html("Total Price (Per Month): $" + globalTotalFormatted);
 
        totalPerYearDisplay.html("Total Price (Per Year): $" + globalTotalPerYearFormatted);
               
        updateCalc = false;
        updateCalc2 = true;
        
        }
    },100);
   
    /* 
    
    
    Functions Start Here
    
    
    */
    
    //Global Discount Calculator ============================================================================================
  
    function globalDiscountCalc(){
        
        if (contractLength == 12){
            
            globalDiscount = .03;
        }
        
        if (contractLength == 24) {
            
            globalDiscount = .06;
        }
        
        if (contractLength == 36){
            
            globalDiscount = .09;
        }
        
        if (contractLength == 48){
            
            globalDiscount = .12;
        }
        
        return globalDiscount;   
    }
    
    
    //Subscription Model Functions ============================================================================================
    
        //Find MAX Licenses in Tier
  
        function subDiscountCalc(){

           if(inputUsers >= maxUser[0]){
               
               maxBucket[0] = maxUser[0];
               licensesInTier[0] = bucket0;
           
           } 
            else {   
               
              maxBucket[0] = maxUser[0];
              licensesInTier[0] = maxBucket[0];
                
           }
            
            if(inputUsers >= maxUser[1]){
                
                maxBucket[1] = maxUser[1];
                licensesInTier[1] = bucket1;
            } 
                else {  
                
                maxBucket[1] = inputUsers;
                licensesInTier[1] = maxBucket[1] - licensesInTier[0];
                    
                 
            }
            
            if(inputUsers >= maxUser[2]){
                maxBucket[2] = maxUser[2]; 
                licensesInTier [2] = bucket2;
               
            } 
           
                else {  
                    
                maxBucket[2] = inputUsers;
                licensesInTier[2] = maxBucket[2] - (licensesInTier[0] + licensesInTier[1]);
                  
            }
            
             if(inputUsers >= maxUser[3]){
                maxBucket[3] = maxUser[3]; 
                  licensesInTier [3] = bucket3;
            }
            else {
                maxBucket[3] = inputUsers;
                licensesInTier[3] = maxBucket[3] - (licensesInTier[0] + licensesInTier[1] + licensesInTier[2]);
            }
            
             if(inputUsers >= maxUser[4]){
                maxBucket[4] = maxUser[4]; 
                  licensesInTier [4] = bucket4;
            }
            else {
                maxBucket[4] = inputUsers;
                licensesInTier[4] = maxBucket[4] - (licensesInTier[0] + licensesInTier[1] + licensesInTier[2] + licensesInTier[3]);
            }
            
             if(inputUsers >= maxUser[5]){
                 maxBucket[5] = maxUser[5]; 
                  licensesInTier [5] = bucket5;
            }
            else {
                maxBucket[5] = inputUsers;
                licensesInTier[5] = maxBucket[5] - (licensesInTier[0] + licensesInTier[1] + licensesInTier[2] + licensesInTier[3] + licensesInTier [4]) ;
            }
            
             if(inputUsers >= maxUser[6]){
                maxBucket[6] = maxUser[6];  
                  licensesInTier [6] = bucket6;
            }
            else {
                maxBucket[6] = inputUsers;
                licensesInTier[6] = maxBucket[6] - (licensesInTier[0] + licensesInTier[1] + licensesInTier[2] + licensesInTier[3] + licensesInTier [4] + licensesInTier[5]);
            }
            
             if(inputUsers >= maxUser[7]){
                maxBucket[7] = maxUser[7];
                  licensesInTier [7] = bucket7;
            }
            else {
                maxBucket[7] = inputUsers;
                licensesInTier[7] = maxBucket[7] - (licensesInTier[0] + licensesInTier[1] + licensesInTier[2] + licensesInTier[3] + licensesInTier [4] + licensesInTier[5] + licensesInTier[6]);
            }
            
             if(inputUsers >= maxUser[8]){
                maxBucket[8] = maxUser[8]; 
                  licensesInTier [8] = bucket8;
            }
            else {
                maxBucket[8] = inputUsers;
                licensesInTier[8] = maxBucket[8] - (licensesInTier[0] + licensesInTier[1] + licensesInTier[2] + licensesInTier[3] + licensesInTier [4] + licensesInTier[5] + licensesInTier[6] + licensesInTier[7]);
            }
            
             if(inputUsers >= maxUser[9]){
                 maxBucket[9] = maxUser[9]; 
                  licensesInTier [9] = bucket9;
            }
            else {
                maxBucket[9] = inputUsers;
                maxBucket[9] = inputUsers;
                licensesInTier[9] = maxBucket[9] - (licensesInTier[0] + licensesInTier[1] + licensesInTier[2] + licensesInTier[3] + licensesInTier [4] + licensesInTier[5] + licensesInTier[6] + licensesInTier[7] + licensesInTier[8]);
            }
            
             if(inputUsers >= maxUser[10]){
                maxBucket[10] = maxUser[10];
                  licensesInTier [10] = bucket10;
            }
            else {
                maxBucket[10] = inputUsers;
                licensesInTier[10] = maxBucket[10] - (licensesInTier[0] + licensesInTier[1] + licensesInTier[2] + licensesInTier[3] + licensesInTier [4] + licensesInTier[5] + licensesInTier[6] + licensesInTier[7] + licensesInTier[8] + licensesInTier[9]);
            }
            
             if(inputUsers >= maxUser[11]){
                maxBucket[11] = maxUser[11];
                  licensesInTier[11] = bucket11;
            }
            else {
                maxBucket[11] = inputUsers;
                licensesInTier[11] = maxBucket[11] - (licensesInTier[0] + licensesInTier[1] + licensesInTier[2] + licensesInTier[3] + licensesInTier [4] + licensesInTier[5] + licensesInTier[6] + licensesInTier[7] + licensesInTier[8] + licensesInTier[9] + licensesInTier[10]);
            }
            
            totalLicensesInTier = licensesInTier.reduce(getSum);
         
            
            eqSubLicenses[0] = licensesInTier[0] * (1 - subDiscount [0]);
            eqSubLicenses[1] = licensesInTier[1] * (1 - subDiscount [1]);
            eqSubLicenses[2] = licensesInTier[2] * (1 - subDiscount [2]);
            eqSubLicenses[3] = licensesInTier[3] * (1 - subDiscount [3]);
            eqSubLicenses[4] = licensesInTier[4] * (1 - subDiscount [4]);
            eqSubLicenses[5] = licensesInTier[5] * (1 - subDiscount [5]);
            eqSubLicenses[6] = licensesInTier[6] * (1 - subDiscount [6]);
            eqSubLicenses[7] = licensesInTier[7] * (1 - subDiscount [7]);
            eqSubLicenses[8] = licensesInTier[8] * (1 - subDiscount [8]);
            eqSubLicenses[9] = licensesInTier[9] * (1 - subDiscount [9]);
            eqSubLicenses[10] = licensesInTier[10] * (1 - subDiscount [10]);
            eqSubLicenses[11] = licensesInTier[11] * (1 - subDiscount [11]);
            
            totalEqLicenses =  eqSubLicenses.reduce(getSum);
            
            return (totalLicensesInTier - totalEqLicenses) / totalLicensesInTier;
         
            
            
        
            
        }
 
    function getSum(total, num) {
        
            return total + num;
        }
    
       
       
            
        //Basic Licenses Included Function

        function calculateBasicLicensesIncluded (x) {
      
            return x / basicRatio;    
        }

        //Advanced Licenses Included Function
        function calculateAdvancedLicensesIncluded (x) { 
            
            return Math.floor(x / advancedRatio);    
        }

        //Super Licenses Included Function
        function calculateSuperLicensesIncluded (x) { 
             
            return  Math.floor(x / superRatio);    
        }

        //Total Basic Licenses Function
        function calculateTotalBasicLicenses(x, y, z) {  
             return Math.ceil(x - (y + z));    
        }

        //Total Advanced Licenses Function
        function calculateTotalAdvancedLicenses(x){
            
            //Check that includedLicensesAdvanced is > 0 
           if (x > 0) {   
               return x;   
           } else {       
               return 0;
           }     
        }

        //Total Super Licenses Function
        function calculateTotalSuperLicenses(x) {
            //Check that includedLicensesSuper is > 0
            if (x > 0) {  
                return x;     
            } else {      
                return 0;     
            }     
        }

        //Subtotal Basic Price Calculator
        function calculateBasicSubtotal(x,y,z) {
              
           return (x-y)*z;
            
        }

        //Subtotal Advanced Price Calculator 
         function calculateAdvancedSubtotal(x,y,z) { 
            
            return (x-y)*z;  
        }

        //Subtotal Super Price Calculator 
         function calculateSuperSubtotal(x,y,z) { 
            
           return (x-y)*z;
        }

        //Grand Total (Per Month) Before Discount
        function calculateTotalPerMonthBeforeDiscount (x, y, z){
            return x + y + z;    
        }

        //Grand Total (Per Year) Before Discount
        function calculateTotalPerYearBeforeDiscount (x){    
            return x * 12;    
        }
   
    //Service Model Functions ============================================================================================
    
        //Find recommended tier    
        function tierFinder (x){

            var tier = "none";

            if (x >= 50 && x <= 100){

                tier = "silver";

            }

             if (x >= 101 && x <= 250){

                tier = "gold";

            }

             if (x >= 251 && x <= 500){

                tier = "platinum";

            }

             if (x >= 501 && x <= 25000){

                tier = "platinum-plus";

            }

            return tier;

        }

        //Calculate tier subtotal

        function tierSubTotalCalc(x){

            var tierTotal= 0;

            if (x == "none"){

                tierTotal = 0; 
            }

            if (x == "silver"){

                tierTotal = silverDollarsPerMonth;
            }

            if (x == "gold"){

                tierTotal = goldDollarsPerMonth;

            }

            if (x == "platinum"){

                tierTotal = platinumDollarsPerMonth;
            }

            if (x == "platinum-plus"){

                tierTotal = platinumPlusDollarsPerMonth;
            }

            return tierTotal;    
        }

        //Calculate days on site per month

        function daysOnSiteCalc(x){

          var siteDays = Math.floor(x/ratioDays)/12;

            return siteDays;

        }

        //Calculate days subtotal per month

        function daySubTotalPerMonthCalc(x){

            var daySubTotal = x * onSiteRatePerDay;

            return daySubTotal;

        }

        //Calculate service hours per month

        function serviceHoursCalc(x){

            var serviceHours = Math.floor(x/ratioWidget)*timeWidget/12;

            return serviceHours;

        }

        //Calculate service hours subtotal per month

        function serviceSubtotalPerMonthCalc (x){

            var serviceHoursSubtotal = x * proServiceRate;

            return serviceHoursSubtotal;
        }

        //Caclulate monthly service plan total

        function servicePlanSubTotalPerMonthCalc(x,y,z){

            return x + y + z;

        }

        //Calculate monthly service plan total with discounts

        function servicePlanTotalPerMonthCalc(w,x,y,z){

            //w = recommendedTier
            //x = TierSubTotal
            //y = days on site total 
            //z = service hours total 

            var servicePlanTotalPerMonth = 0;

            if(w == "none"){

                servicePlanTotalPerMonth = proServiceRate;

            }

            if(w == "silver"){

                servicePlanTotalPerMonth = x + (y * (1 - silverDiscount)) + (z * (1 - silverDiscount));

            }

            if(w == "gold"){

                 servicePlanTotalPerMonth = x + (y * (1 - goldDiscount)) + (z * (1 - goldDiscount));

            }

            if(w == "platinum"){

                servicePlanTotalPerMonth = x + (y * (1 - platinumDiscount)) + (z * (1 - platinumDiscount));

            }

            if(w == "platinum-plus"){

                servicePlanTotalPerMonth = x + (y * (1 - platinumPlusDiscount)) + (z * (1 - platinumPlusDiscount));

            }

            return servicePlanTotalPerMonth;

        }
    
    //Hardware Model Functions ============================================================================================
    
        function ipadTotalPerMonth(){
    
        return (ipadCost + ipadLabor + ipadCaseCost + ipadCaseLabor)/contractLength; 
            
        }
    
        
    //Calculate total Markup per month 
    
        function totalMarkupBreakdown (){
        
        
        return markupPerMonth * contractLength * ipadTotalPerMonth();
        
        
        }
    
       //Calculate Insurance Per Month
       
        function insuranceBreakdown(){
        
        return insurancePerMonth * contractLength * ipadTotalPerMonth();
        
        }
    
      //Calculate Subtotal Per Month Breakdown
       
        function subTotalPerMonth () {
        
        return ipadTotalPerMonth() + totalMarkupBreakdown() + insuranceBreakdown() + managedSolution;
        
        }
    
      //Calculate ipads needed
        
        function ipadQuantity (x) {
        
        if(x > 29){
        
        return Math.floor(inputUsers / userToIpadRatio);
            
        } else if (x < 30){
            
            return 2;
            
        }
        
    }
    
      //Calculate total hardware cost per month
    
        function totalHardwareCost (x,y){
        
        return x * y;
        
        
    }
        
    
    
      //Format commas into number output
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    


             
});

