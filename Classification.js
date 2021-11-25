<script>
        document.body.style.backgroundColor = "#4dffff";
        var recs = JSON.parse(localStorage.myRecs);
        var recsPerPages = JSON.parse(localStorage.myRecsPerPages);
        var bufferFrames = JSON.parse(localStorage.myBufferFrames);
        var pages = JSON.parse(localStorage.myPages);
        var bufferLength = JSON.parse(localStorage.myBufferLength);
        var comment;
        var steps = 0;
        var run = true;

        var infileArray = new Array(recs);
        var bufferArray = new Array(bufferLength);
        var outFileArray = new Array(recs);
        var prevInfileArray = new Array(recs);
        var prevBufferArray = new Array(recs);
        var prevOutfileArray = new Array(recs);
        var helpStartArray = new Array(recs);

        for(i=0;i<recs;i++) {
            infileArray[i] = '-';
        }
        for(i=0;i<recs;i++) {
            helpStartArray[i] = '-';
        }
        
        for(i=0;i<recs;i++) {
            outFileArray[i] = '-';
        }
        for(i=0;i<recs;i++) {
            prevInfileArray[i] = '-';
        }
        for(i=0;i<bufferLength;i++) {
            bufferArray[i] = '-';
        }
        for(i=0;i<recs;i++) {
            prevBufferArray[i] = '-';
        }
        for(i=0;i<recs;i++) {
            prevOutfileArray[i] = '-';
        }
        
        //Λειτουργια του κουμπιου next step
        $('#toNextStep').click(function() {
            $('#values').html("recs: " + recs +"<br />"+"recsPerPage: " + recsPerPages + "<br />" +"bufferFrames: " + bufferFrames);
            steps++;
            if(run) {
            
                comment = document.getElementById('comment').innerHTML;
                if(comment=="Lets Start") {
                    fillInfileDisk();
                }
                else if(comment=="---Filling the infile Disk---") {
                    loadBuffer();
                }
                else if(comment=="---Loading the buffer---") {
                    sortBuffer();
                }
                else if(comment=="---Sorting the buffer (if needed)---") {
                    loadOutFile();
                }
                else if(comment=="---Loading the outfile disk and emptying buffer---") {
                    loadBuffer();
                }
            }
            else {
                localStorage.myoutFileArray=JSON.stringify(outFileArray);
                
                var trainArray = new Array();
                //Math.ceil(recs/(bufferLength*(myBufferFrames-1)))
                var countTrains = 0;
                for(i=0;i<recs;i++) {
                    if(i%bufferLength==0) {
                      trainArray[countTrains] = i;
                      countTrains++;
                    }
                }
                
                trainArray[countTrains] = infileArray.length;
                var prevTrainLength = trainArray[0];
                localStorage.myTrainArray=JSON.stringify(trainArray);
                var passes = 1;
                localStorage.myPasses=JSON.stringify(passes);
                if(countTrains<2) {
                    var trainReps = new Array();
                    trainReps[0] = infileArray.length;
                }
                else {
                    var trainReps = new Array();
                    var count = 0;
                    for(var i=1;i<recs;i++) {
                        if(i%(bufferLength*(bufferFrames-1))==0) {
                            trainReps[count] = i;
                            count++;
                        }
                    }
                    trainReps[count] = infileArray.length;
                }
 
                localStorage.mytrainReps=JSON.stringify(trainReps);
                localStorage.myPrevTrainLength=JSON.stringify(prevTrainLength);

                document.getElementById('step').innerHTML = "finished";
                document.getElementById('comment').innerHTML = "END - NO MORE PAGES TO LOAD"; 
                document.getElementById('toNextStep').innerHTML = 'Go to the next pass or end the procedure';  
                $('#toNextStep').click(function() {
                location.href = 'pass1.html';
                }
                )
            }

        }
        )

        function fillInfileDisk() {
            document.getElementById('step').innerHTML = "Step" + steps;
            document.getElementById('comment').innerHTML = "---Filling the infile Disk---"
            
            for(i=0;i<recs;i++) {
                infileArray[i] = Math.ceil(Math.random()*100);
                helpStartArray[i] = infileArray[i];
            }

            document.getElementById('infile').innerHTML = "(" + infileArray + ")";
        }

        function loadBuffer() {
            document.getElementById('step').innerHTML = "Step" + steps;
            var counter = 0;
            document.getElementById('comment').innerHTML = "---Loading the buffer---"
            
            for(i=0;i<recs;i++) {
                if(infileArray[i]!='-' && counter!=bufferLength) {
                    counter++;
                    bufferArray[i%bufferLength] = infileArray[i];
                    prevInfileArray[i] = infileArray[i];
                    prevBufferArray[i] = infileArray[i];
                    infileArray[i] = '-';
                }
            }   
            
            document.getElementById('buffer').innerHTML = "(" + bufferArray + ")";
            document.getElementById('infile').innerHTML = "(" + infileArray + ")";
        }

        function sortBuffer() {
            document.getElementById('step').innerHTML = "Step" + steps;
            document.getElementById('comment').innerHTML = "---Sorting the buffer (if needed)---"
            bubbleSort(bufferArray);
            document.getElementById('buffer').innerHTML = "(" + bufferArray + ")";
        }

        function loadOutFile() {
            document.getElementById('step').innerHTML = "Step" + steps;
            var counter = 0;
            document.getElementById('comment').innerHTML = "---Loading the outfile disk and emptying buffer---"
            for(i=0;i<recs;i++) {
                if(outFileArray[i]=='-' && counter!=bufferLength) {
                    counter++;
                    outFileArray[i] = bufferArray[i%bufferLength];
                    prevOutfileArray[i] = bufferArray[i%bufferLength];
                    bufferArray[i%bufferLength] = '-'; 
                    run = true;
                }
            }

            for(i=0;i<recs;i++) {
                if(outFileArray[i]=='-') {
                    run = true;
                }
                else {
                    run = false;
                }
            }

            document.getElementById('buffer').innerHTML = "(" + bufferArray + ")";
            document.getElementById('outFile').innerHTML = "(" + outFileArray + ")";
        }
        
        function bubbleSort(a) {
            var swapped;
            do {
              swapped = false;
              for (var i=0; i < a.length; i++) {
               if (a[i] > a[i+1]) {
                  var temp = a[i];
                   a[i] = a[i+1];
                   a[i+1] = temp;
                   swapped = true;
                }
            }
            } while (swapped);
         }      
        
    </script>
