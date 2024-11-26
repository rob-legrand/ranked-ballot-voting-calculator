function calcall()
{
   var result, str, strmeth = new Array(), tbused = false;
   if (readvotes())
   {
      str = "<html><head><title>Election results</title>\n" +
            "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
            "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
            "<h1>Election results</h1>\n";
      for (i in candtonum)
         strmeth[i] = "";
      result = calcbald(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Baldwin" + (result.tiebreak ? "*" : "") + "<br>";
      result = calcblac(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Black" + (result.tiebreak ? "*" : "") + "<br>";
      result = calcbord(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Borda" + (result.tiebreak ? "*" : "") + "<br>";
      if (!equalranks)
      {
         result = calcbuck(false);
         if (result.tiebreak)
            tbused = true;
         strmeth[result.winner] += "Bucklin" + (result.tiebreak ? "*" : "") + "<br>";
         result = calccare(false);
         if (result.tiebreak)
            tbused = true;
         strmeth[result.winner] += "Carey" + (result.tiebreak ? "*" : "") + "<br>";
         result = calccoom(false);
         if (result.tiebreak)
            tbused = true;
         strmeth[result.winner] += "Coombs" + (result.tiebreak ? "*" : "") + "<br>";
      }
      result = calccope(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Copeland" + (result.tiebreak ? "*" : "") + "<br>";
      result = calcdodg(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Dodgson" + (result.tiebreak ? "*" : "") + "<br>";
      if (!equalranks)
      {
         result = calchare(false);
         if (result.tiebreak)
            tbused = true;
         strmeth[result.winner] += "Hare" + (result.tiebreak ? "*" : "") + "<br>";
      }
/*      result = calclegr(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "LeGrand" + (result.tiebreak ? "*" : "") + "<br>"; */
      result = calcnans(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Nanson" + (result.tiebreak ? "*" : "") + "<br>";
      result = calcrayn(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Raynaud" + (result.tiebreak ? "*" : "") + "<br>";
      result = calcschu(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Schulze" + (result.tiebreak ? "*" : "") + "<br>";
      result = calcsimp(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Simpson" + (result.tiebreak ? "*" : "") + "<br>";
      result = calcsmal(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Small" + (result.tiebreak ? "*" : "") + "<br>";
      result = calctide(false);
      if (result.tiebreak)
         tbused = true;
      strmeth[result.winner] += "Tideman" + (result.tiebreak ? "*" : "") + "<br>";
      str += "<p><table border cellpadding=9>\n" +
             "<tr><th>winner</th><th>method(s)</th></tr>\n";
      for (i in numtocand)
         if (strmeth[numtocand[i]].length > 0)
            str += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" + strmeth[numtocand[i]].replace(/<br>$/, "") +
                   "</td></tr>\n";
      str += "</table></p>";
      if (tbused)
         str += "\n<p>* The ranking " + printtiebreak(tbtonum) + " was used as a random-ballot tiebreaker.</p>\n";
      str += "<hr align=\"left\" width=\"50%\">\n" +
             "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote);
      if (smith.length > 1)
      {
         str += "<p>There is no Condorcet winner.&nbsp; The Smith set ";
         if (smith.length < numtocand.length)
         {
            str += "is {";
            for (i in smith)
               str += "<span class=\"cand\">" + numtocand[smith[i]] + "</span>" + (i < smith.length - 1 ? ", " : "");
            str += "}.";
         }
         else
            str += "includes all of the candidates.";
         if (schwartz.length < smith.length)
            if (schwartz.length > 1)
            {
               str += "&nbsp; The Schwartz set is {";
               for (i in schwartz)
                  str += "<span class=\"cand\">" + numtocand[schwartz[i]] + "</span>" + (i < schwartz.length - 1 ? ", " : "");
               str += "}.";
            }
            else
               str += "&nbsp; The Schwartz winner is <span class=\"cand\">" + numtocand[schwartz[0]] + "</span>.";
         str += "</p>\n";
      }
      else
         str += "<p><span class=\"cand\">" + numtocand[smith[0]] + "</span> is the Condorcet winner.</p>\n";
      document.write(str + "</body></html>");
      document.close();
   }
}
function calcbald(onlyone)
{
   var consider = new Array(), elim, elimset, i, j, nconsider, result = new Object(), score = new Array(), str1, str2, worstscore;
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Baldwin election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Baldwin election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote) +
             "<p>A candidate&rsquo;s Borda score can be found by subtracting its column sum from its row sum.</p>\n" +
             "<p>The candidates&rsquo; Borda scores:</p>\n";
   }
   for (i in numtocand)
   {
      consider[consider.length] = true;
      score[score.length] = 0;
   }
   nconsider = numtocand.length;
   result.tiebreak = false;
   while (true)
   {
      for (i in pvote)
         if (consider[i])
         {
            score[i] = 0;
            for (j in pvote[i])
               if (i != j && consider[j])
                  score[i] += pvote[i][j] - pvote[j][i];
         }
      if (onlyone)
      {
         str2 += "<table border cellpadding=3>\n";
         for (i in numtocand)
            if (consider[i])
               str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" + score[i] / 2 + "</td></tr>\n";
         str2 += "</table>\n" +
                 "<p>";
      }
      worstscore = Number.MAX_VALUE;
      for (i in score)
         if (consider[i])
            if (score[i] < worstscore)
               worstscore = score[i];
      elimset = new Array();
      for (i in score)
         if (consider[i])
            if (score[i] == worstscore)
               elimset[elimset.length] = i;
      elim = elimset[0];
      if (elimset.length == 1)
      {
         if (onlyone)
            str2 += "<span class=\"cand\">" + numtocand[elim] + "</span> has the single worst Borda score and so is eliminated.</p>\n";
      }
      else
      {
         for (i in elimset)
            if (numtotb[elimset[i]] > numtotb[elim])
               elim = elimset[i];
         result.tiebreak = true;
         if (onlyone)
         {
            if (elimset.length == nconsider)
               str2 += "All of the candidates";
            else
               for (i in elimset)
                  str2 += "<span class=\"cand\">" + numtocand[elimset[i]] + "</span>" +
                          (i == elimset.length - 2 ? " and " : i == elimset.length - 1 ? "" : ", ");
            str2 += " have equally worst Borda scores, so a random-ballot tiebreaker must be used:</p>\n" +
                    "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                    "<p><span class=\"cand\">" + numtocand[elim] + "</span> is the lowest of them in the tiebreaking ranking and so is eliminated.</p>\n";
         }
      }
      consider[elim] = false;
      --nconsider;
      if (nconsider <= 1)
         break;
      if (onlyone)
         str2 += "<p>The reduced pairwise matrix:</p>\n" +
                 printpmatrix(pvote, consider) +
                 "<p>The candidates&rsquo; new Borda scores:</p>\n";
   }
   for (i in consider)
      if (consider[i])
         result.winner = numtocand[i];
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Baldwin election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "<p><span class=\"cand\">" + result.winner + "</span> is the only remaining candidate and so wins the election.</p>\n" +
              "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calcblac(onlyone)
{
   var bestscore = -Number.MAX_VALUE, i, j, result = new Object(), score = new Array(), str1, str2, winset = new Array();
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Black election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Black election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote);
   }
   for (i in pvote)
   {
      score[score.length] = 0;
      for (j in pvote[i])
         if (i != j)
            if (pvote[i][j] > pvote[j][i])
               ++score[i];
   }
   for (i in score)
      if (score[i] > bestscore)
         bestscore = score[i];
   if (bestscore == numtocand.length - 1)
   {
      for (i in score)
         if (score[i] == bestscore)
            winset[winset.length] = i;
      result.winner = numtocand[winset[0]];
      result.tiebreak = false;
      if (onlyone)
         str2 += "<p><span class=\"cand\">" + result.winner + "</span> wins all of its pairwise comparisons and so wins the election outright.</p>\n";
   }
   else
   {
      if (onlyone)
         str2 += "<p>There is no Condorcet winner, so the candidates&rsquo; Borda scores are compared.</p>\n" +
                 "<p>A candidate&rsquo;s Borda score can be found by subtracting its column sum from its row sum.</p>\n" +
                 "<p>The candidates&rsquo; Borda scores:</p>\n" +
                 "<table border cellpadding=3>\n";
      for (i in pvote)
      {
         score[i] = 0;
         for (j in pvote[i])
            if (i != j)
               score[i] += pvote[i][j] - pvote[j][i];
      }
      if (onlyone)
      {
         for (i in numtocand)
            str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" + score[i] / 2 + "</td></tr>\n";
         str2 += "</table>\n" +
                 "<p>";
      }
      bestscore = -Number.MAX_VALUE;
      for (i in score)
         if (score[i] > bestscore)
            bestscore = score[i];
      for (i in score)
         if (score[i] == bestscore)
            winset[winset.length] = i;
      if (winset.length == 1)
      {
         result.winner = numtocand[winset[0]];
         result.tiebreak = false;
         if (onlyone)
            str2 += "<span class=\"cand\">" + result.winner + "</span> has the single best Borda score and so wins the election outright.</p>\n";
      }
      else
      {
         result.winner = winset[0];
         for (i in winset)
            if (numtotb[winset[i]] < numtotb[result.winner])
               result.winner = winset[i];
         result.winner = numtocand[result.winner];
         result.tiebreak = true;
         if (onlyone)
         {
            if (winset.length == numtocand.length)
               str2 += "All of the candidates";
            else
               for (i in winset)
                  str2 += "<span class=\"cand\">" + numtocand[winset[i]] + "</span>" +
                          (i == winset.length - 2 ? " and " : i == winset.length - 1 ? "" : ", ");
            str2 += " have equally best Borda scores, so a random-ballot tiebreaker must be used:</p>\n" +
                    "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                    "<p><span class=\"cand\">" + result.winner +
                    "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
         }
      }
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Black election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calcbord(onlyone)
{
   var bestscore = -Number.MAX_VALUE, i, j, result = new Object(), score = new Array(), str1, str2, winset = new Array();
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Borda election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Borda election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote) +
             "<p>A candidate&rsquo;s Borda score can be found by subtracting its column sum from its row sum.</p>\n" +
             "<p>The candidates&rsquo; Borda scores:</p>\n" +
             "<table border cellpadding=3>\n";
   }
   for (i in pvote)
   {
      score[score.length] = 0;
      for (j in pvote[i])
         if (i != j)
            score[i] += pvote[i][j] - pvote[j][i];
   }
   if (onlyone)
   {
      for (i in numtocand)
         str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" + score[i] / 2 + "</td></tr>\n";
      str2 += "</table>\n" +
              "<p>";
   }
   for (i in score)
      if (score[i] > bestscore)
         bestscore = score[i];
   for (i in score)
      if (score[i] == bestscore)
         winset[winset.length] = i;
   if (winset.length == 1)
   {
      result.winner = numtocand[winset[0]];
      result.tiebreak = false;
      if (onlyone)
         str2 += "<span class=\"cand\">" + result.winner + "</span> has the single best Borda score and so wins the election outright.</p>\n";
   }
   else
   {
      result.winner = winset[0];
      for (i in winset)
         if (numtotb[winset[i]] < numtotb[result.winner])
            result.winner = winset[i];
      result.winner = numtocand[result.winner];
      result.tiebreak = true;
      if (onlyone)
      {
         if (winset.length == numtocand.length)
            str2 += "All of the candidates";
         else
            for (i in winset)
               str2 += "<span class=\"cand\">" + numtocand[winset[i]] + "</span>" +
                       (i == winset.length - 2 ? " and " : i == winset.length - 1 ? "" : ", ");
         str2 += " have equally best Borda scores, so a random-ballot tiebreaker must be used:</p>\n" +
                 "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                 "<p><span class=\"cand\">" + result.winner + "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
      }
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Borda election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calcbuck(onlyone)
{
   var bestscore = 0, i, j, quota, result = new Object(), score = new Array(), str1, str2, winset = new Array();
   if (onlyone)
   {
      if (!readvotes())
         return;
      if (equalranks)
      {
         alert("Bucklin elections require fully-ranked ballots with no tied preferences.  Please correct the ranked ballots and try again or try " +
               "another method.");
         return;
      }
      str1 = "<html><head><title>Bucklin election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Bucklin election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote();
   }
   for (i in numtocand)
      score[score.length] = 0;
   quota = 0;
   for (i in rvote)
      quota += rvotenum[i];
   quota /= 2;
   if (onlyone)
      str2 += "<p>A majority total of " + Math.floor(quota + 1) + " votes is necessary to win.</p>\n" +
              "<p>The candidates&rsquo; first-rank totals:</p>\n" +
              "<table border cellpadding=3>\n";
   for (i in numtocand)
   {
      for (j in rvote)
         score[rvote[j][i]] += rvotenum[j];
      for (j in score)
         if (score[j] > bestscore)
            bestscore = score[j];
      if (onlyone)
      {
         for (j in numtocand)
            str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[j] + "</span></td><td>" + score[j] + "</td></tr>\n";
         str2 += "</table>\n" +
                 "<p>";
      }
      if (bestscore > quota)
         break;
      if (onlyone)
         str2 += "No candidate has a majority yet, so " + (i == 0 ? "second" : i == 1 ? "third" : i == 2 ? "fourth" : i + 2 + "th") +
                 "-rank totals are added:</p>\n" +
                 "<table border cellpadding=3>\n";
   }
   for (i in score)
      if (score[i] == bestscore)
         winset[winset.length] = i;
   if (winset.length == 1)
   {
      result.winner = numtocand[winset[0]];
      result.tiebreak = false;
      if (onlyone)
         str2 += "<span class=\"cand\">" + result.winner + "</span> has the single best Bucklin score and so wins the election outright.</p>\n";
   }
   else
   {
      result.winner = winset[0];
      for (i in winset)
         if (numtotb[winset[i]] < numtotb[result.winner])
            result.winner = winset[i];
      result.winner = numtocand[result.winner];
      result.tiebreak = true;
      if (onlyone)
      {
         if (winset.length == numtocand.length)
            str2 += "All of the candidates";
         else
            for (i in winset)
               str2 += "<span class=\"cand\">" + numtocand[winset[i]] + "</span>" +
                       (i == winset.length - 2 ? " and " : i == winset.length - 1 ? "" : ", ");
         str2 += " have equally best Bucklin scores, so a random-ballot tiebreaker must be used:</p>\n" +
                 "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                 "<p><span class=\"cand\">" + result.winner + "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
      }
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Bucklin election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calccare(onlyone)
{
   var consider = new Array(), elimset, i, j, nconsider, quota, result = new Object(), score = new Array(), str1, str2;
   if (onlyone)
   {
      if (!readvotes())
         return;
      if (equalranks)
      {
         alert("Carey elections require fully-ranked ballots with no tied preferences.  Please correct the ranked ballots and try again or try another " +
               "method.");
         return;
      }
      str1 = "<html><head><title>Carey election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Carey election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The candidates&rsquo; first-rank totals:</p>\n";
   }
   for (i in numtocand)
   {
      consider[consider.length] = true;
      score[score.length] = 0;
   }
   nconsider = numtocand.length;
   result.tiebreak = false;
   while (true)
   {
      for (i in score)
         score[i] = 0;
      quota = 0;
      for (i in rvote)
         for (j in rvote[i])
            if (consider[rvote[i][j]])
            {
               score[rvote[i][j]] += rvotenum[i];
               quota += rvotenum[i];
               break;
            }
      quota /= nconsider;
      if (onlyone)
      {
         str2 += "<table border cellpadding=3>\n";
         for (i in numtocand)
            if (consider[i])
               str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" + score[i] + "</td></tr>\n";
         str2 += "</table>\n" +
                 "<p>The average first-rank total is " + Math.round(1000 * quota) / 1000 + ".</p>\n" +
                 "<p>";
      }
      elimset = new Array();
      for (i in score)
         if (consider[i])
            if (score[i] < quota)
               elimset[elimset.length] = i;
      if (elimset.length == 0)
         for (i in score)
            if (consider[i])
               if (score[i] <= quota)
                  elimset[elimset.length] = i;
      if (elimset.length == nconsider)
         break;
      for (i in elimset)
      {
         consider[elimset[i]] = false;
         --nconsider;
         if (onlyone)
            str2 += "<span class=\"cand\">" + numtocand[elimset[i]] + "</span>" +
                    (i == elimset.length - 2 ? " and " : i == elimset.length - 1 ? "" : ", ");
      }
      if (onlyone)
         str2 += (elimset.length == 1 ? " has a below-average first-rank total and so is" : " have below-average first-rank totals and so are") +
                 " eliminated.</p>\n";
      if (nconsider <= 1)
         break;
      if (onlyone)
         str2 += "<p>The reduced ranked ballots:</p>\n" +
                 printrvote(consider) +
                 "<p>The candidates&rsquo; new first-rank totals:</p>\n";
   }
   if (nconsider > 1)
   {
      result.winner = elimset[0];
      for (i in elimset)
         if (numtotb[elimset[i]] < numtotb[result.winner])
            result.winner = elimset[i];
      result.winner = numtocand[result.winner];
      result.tiebreak = true;
      if (onlyone)
         str2 += "All of the " + (nconsider == numtocand.length ? "" : "remaining ") +
                 "candidates have equal first-rank totals, so a random-ballot tiebreaker must be used:</p>\n" +
                 "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                 "<p><span class=\"cand\">" + result.winner + "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
   }
   else
   {
      for (i in consider)
         if (consider[i])
            result.winner = numtocand[i];
      str2 += "<p><span class=\"cand\">" + result.winner + "</span> is the only remaining candidate and so wins the election outright.</p>\n";
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Carey election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calccoom(onlyone)
{
   var consider = new Array(), elim, elimset, i, j, nconsider, result = new Object(), score = new Array(), str1, str2, worstscore;
   if (onlyone)
   {
      if (!readvotes())
         return;
      if (equalranks)
      {
         alert("Coombs elections require fully-ranked ballots with no tied preferences.  Please correct the ranked ballots and try again or try another " +
               "method.");
         return;
      }
      str1 = "<html><head><title>Coombs election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Coombs election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The candidates&rsquo; last-rank totals:</p>\n";
   }
   for (i in numtocand)
   {
      consider[consider.length] = true;
      score[score.length] = 0;
   }
   nconsider = numtocand.length;
   result.tiebreak = false;
   while (true)
   {
      for (i in score)
         score[i] = 0;
      for (i in rvote)
         for (j = rvote[i].length - 1; j >= 0; --j)
            if (consider[rvote[i][j]])
            {
               score[rvote[i][j]] += rvotenum[i];
               break;
            }
      if (onlyone)
      {
         str2 += "<table border cellpadding=3>\n";
         for (i in numtocand)
            if (consider[i])
               str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" + score[i] + "</td></tr>\n";
         str2 += "</table>\n" +
                 "<p>";
      }
      worstscore = 0;
      for (i in score)
         if (consider[i])
            if (score[i] > worstscore)
               worstscore = score[i];
      elimset = new Array();
      for (i in score)
         if (consider[i])
            if (score[i] == worstscore)
               elimset[elimset.length] = i;
      elim = elimset[0];
      if (elimset.length == 1)
      {
         if (onlyone)
            str2 += "<span class=\"cand\">" + numtocand[elim] + "</span> has the single largest last-rank total and so is eliminated.</p>\n";
      }
      else
      {
         for (i in elimset)
            if (numtotb[elimset[i]] > numtotb[elim])
               elim = elimset[i];
         result.tiebreak = true;
         if (onlyone)
         {
            if (elimset.length == nconsider)
               str2 += "All of the candidates";
            else
               for (i in elimset)
                  str2 += "<span class=\"cand\">" + numtocand[elimset[i]] + "</span>" +
                          (i == elimset.length - 2 ? " and " : i == elimset.length - 1 ? "" : ", ");
            str2 += " have equally largest last-rank totals, so a random-ballot tiebreaker must be used:</p>\n" +
                    "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                    "<p><span class=\"cand\">" + numtocand[elim] + "</span> is the lowest of them in the tiebreaking ranking and so is eliminated.</p>\n";
         }
      }
      consider[elim] = false;
      --nconsider;
      if (nconsider <= 1)
         break;
      if (onlyone)
         str2 += "<p>The reduced ranked ballots:</p>\n" +
                 printrvote(consider) +
                 "<p>The candidates&rsquo; new last-rank totals:</p>\n";
   }
   for (i in consider)
      if (consider[i])
         result.winner = numtocand[i];
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Coombs election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "<p><span class=\"cand\">" + result.winner + "</span> is the only remaining candidate and so wins the election.</p>\n" +
              "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calccope(onlyone)
{
   var bestscore = 0, i, j, result = new Object(), score = new Array(), str1, str2, winset = new Array();
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Copeland election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Copeland election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote) +
             "<p>A candidate&rsquo;s Copeland score is the number of its pairwise victories, where a pairwise tie counts as half a victory.</p>\n" +
             "<p>The candidates&rsquo; Copeland scores:</p>\n" +
             "<table border cellpadding=3>\n";
   }
   for (i in pvote)
   {
      score[score.length] = 0;
      for (j in pvote[i])
         if (i != j)
            if (pvote[i][j] > pvote[j][i])
               score[i] += 2;
            else if (pvote[i][j] == pvote[j][i])
               ++score[i];
   }
   if (onlyone)
   {
      for (i in numtocand)
         str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" +
                 (score[i] % 2 == 1 ? (score[i] > 2 ? (score[i] - 1) / 2 : "") + "&frac12;" : score[i] / 2) + "</td></tr>\n";
      str2 += "</table>\n" +
              "<p>";
   }
   for (i in score)
      if (score[i] > bestscore)
         bestscore = score[i];
   for (i in score)
      if (score[i] == bestscore)
         winset[winset.length] = i;
   if (winset.length == 1)
   {
      result.winner = numtocand[winset[0]];
      result.tiebreak = false;
      if (onlyone)
         str2 += "<span class=\"cand\">" + result.winner + "</span> has the single best Copeland score and so wins the election outright.</p>\n";
   }
   else
   {
      result.winner = winset[0];
      for (i in winset)
         if (numtotb[winset[i]] < numtotb[result.winner])
            result.winner = winset[i];
      result.winner = numtocand[result.winner];
      result.tiebreak = true;
      if (onlyone)
      {
         if (winset.length == numtocand.length)
            str2 += "All of the candidates";
         else
            for (i in winset)
               str2 += "<span class=\"cand\">" + numtocand[winset[i]] + "</span>" +
                       (i == winset.length - 2 ? " and " : i == winset.length - 1 ? "" : ", ");
         str2 += " have equally best Copeland scores, so a random-ballot tiebreaker must be used:</p>\n" +
                 "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                 "<p><span class=\"cand\">" + result.winner + "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
      }
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Copeland election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calcdodg(onlyone)
{
   var bestscore = Number.MAX_VALUE, i, j, result = new Object(), score = new Array(), str1, str2, winset = new Array();
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Dodgson election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Dodgson election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote) +
             "<p>A candidate&rsquo;s Dodgson score is the sum of the margins of its pairwise defeats.</p>\n" +
             "<p>The candidates&rsquo; Dodgson scores:</p>\n" +
             "<table border cellpadding=3>\n";
   }
   for (i in pvote)
   {
      score[score.length] = 0;
      for (j in pvote[i])
         if (i != j && pvote[i][j] < pvote[j][i])
            score[i] += pvote[j][i] - pvote[i][j];
   }
   if (onlyone)
   {
      for (i in numtocand)
         str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" + score[i] / 2 + "</td></tr>\n";
      str2 += "</table>\n" +
              "<p>";
   }
   for (i in score)
      if (score[i] < bestscore)
         bestscore = score[i];
   for (i in score)
      if (score[i] == bestscore)
         winset[winset.length] = i;
   if (winset.length == 1)
   {
      result.winner = numtocand[winset[0]];
      result.tiebreak = false;
      if (onlyone)
         str2 += "<span class=\"cand\">" + result.winner + "</span> has the single best Dodgson score and so wins the election outright.</p>\n";
   }
   else
   {
      result.winner = winset[0];
      for (i in winset)
         if (numtotb[winset[i]] < numtotb[result.winner])
            result.winner = winset[i];
      result.winner = numtocand[result.winner];
      result.tiebreak = true;
      if (onlyone)
      {
         if (winset.length == numtocand.length)
            str2 += "All of the candidates";
         else
            for (i in winset)
               str2 += "<span class=\"cand\">" + numtocand[winset[i]] + "</span>" +
                       (i == winset.length - 2 ? " and " : i == winset.length - 1 ? "" : ", ");
         str2 += " have equally best Dodgson scores, so a random-ballot tiebreaker must be used:</p>\n" +
                 "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                 "<p><span class=\"cand\">" + result.winner + "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
      }
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Dodgson election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calchare(onlyone)
{
   var consider = new Array(), elim, elimset, i, j, nconsider, result = new Object(), score = new Array(), str1, str2, worstscore;
   if (onlyone)
   {
      if (!readvotes())
         return;
      if (equalranks)
      {
         alert("Hare elections require fully-ranked ballots with no tied preferences.  Please correct the ranked ballots and try again or try another " +
               "method.");
         return;
      }
      str1 = "<html><head><title>Hare election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Hare election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The candidates&rsquo; first-rank totals:</p>\n";
   }
   for (i in numtocand)
   {
      consider[consider.length] = true;
      score[score.length] = 0;
   }
   nconsider = numtocand.length;
   result.tiebreak = false;
   while (true)
   {
      for (i in score)
         score[i] = 0;
      for (i in rvote)
         for (j in rvote[i])
            if (consider[rvote[i][j]])
            {
               score[rvote[i][j]] += rvotenum[i];
               break;
            }
      if (onlyone)
      {
         str2 += "<table border cellpadding=3>\n";
         for (i in numtocand)
            if (consider[i])
               str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" + score[i] + "</td></tr>\n";
         str2 += "</table>\n" +
                 "<p>";
      }
      worstscore = Number.MAX_VALUE;
      for (i in score)
         if (consider[i])
            if (score[i] < worstscore)
               worstscore = score[i];
      elimset = new Array();
      for (i in score)
         if (consider[i])
            if (score[i] == worstscore)
               elimset[elimset.length] = i;
      if (worstscore == 0)
      {
         if (onlyone)
         {
            for (i in elimset)
               str2 += "<span class=\"cand\">" + numtocand[elimset[i]] + "</span>" +
                       (i == elimset.length - 2 ? " and " : i == elimset.length - 1 ? " " : ", ");
            str2 += (elimset.length == 1 ? "has no first-rank votes and so is" : "have no first-rank votes and so are") + " eliminated.</p>\n";
         }
         for (i in elimset)
            consider[elimset[i]] = false;
         nconsider -= elimset.length;
      }
      else
      {
         elim = elimset[0];
         if (elimset.length == 1)
         {
            if (onlyone)
               str2 += "<span class=\"cand\">" + numtocand[elim] + "</span> has the single smallest first-rank total and so is eliminated.</p>\n";
         }
         else
         {
            for (i in elimset)
               if (numtotb[elimset[i]] > numtotb[elim])
                  elim = elimset[i];
            result.tiebreak = true;
            if (onlyone)
            {
               if (elimset.length == nconsider)
                  str2 += "All of the candidates";
               else
                  for (i in elimset)
                     str2 += "<span class=\"cand\">" + numtocand[elimset[i]] + "</span>" +
                             (i == elimset.length - 2 ? " and " : i == elimset.length - 1 ? "" : ", ");
               str2 += " have equally smallest first-rank totals, so a random-ballot tiebreaker must be used:</p>\n" +
                       "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                       "<p><span class=\"cand\">" + numtocand[elim] +
                       "</span> is the lowest of them in the tiebreaking ranking and so is eliminated.</p>\n";
            }
         }
         consider[elim] = false;
         --nconsider;
      }
      if (nconsider <= 1)
         break;
      if (onlyone)
         str2 += "<p>The reduced ranked ballots:</p>\n" +
                 printrvote(consider) +
                 "<p>The candidates&rsquo; new first-rank totals:</p>\n";
   }
   for (i in consider)
      if (consider[i])
         result.winner = numtocand[i];
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Hare election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "<p><span class=\"cand\">" + result.winner + "</span> is the only remaining candidate and so wins the election.</p>\n" +
              "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
/* function calclegrandschulze(onlyone)
{
   var beat = new Array(), beatlength, beatold = new Array(), beatstr = new Array(), beatstrold = new Array(), i, j, k, result = new Object(),
       score = new Array(), str1, str2, winset = new Array();
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>LeGrand election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>LeGrand election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote);
   }
   for (i in pvote)
   {
      beat[beat.length] = new Array();
      beatold[beatold.length] = new Array();
      beatstr[beatstr.length] = new Array();
      beatstrold[beatstrold.length] = new Array();
      for (j in pvote[i])
      {
         beat[i][beat[i].length] = beatold[i][beatold[i].length] = pvote[i][j];
         beatstr[i][beatstr[i].length] = beatstrold[i][beatstrold[i].length] = numtocand[i] + ">" + numtocand[j];
      }
      score[score.length] = 0;
   }
   for (beatlength = 1; beatlength < numtocand.length; ++beatlength)
   {
      if (onlyone)
      {
         str2 += "<p>Comparisons of strongest beatpaths of length at most " + beatlength + " for each pair of candidates:</p>\n" +
                 "<table border cellpadding=3>\n";
         for (i in numtocand)
            for (j in numtocand)
               if (i < j)
                  str2 += "<tr align=\"center\"><td" + (beat[i][j] > beat[j][i] ? " class=\"win\"" : beat[i][j] < beat[j][i] ? " class=\"loss\"" : "") +
                          "><span class=\"cand\">" + beatstr[i][j] + "</span></td><td" +
                          (beat[i][j] > beat[j][i] ? " class=\"win\"" : beat[i][j] < beat[j][i] ? " class=\"loss\"" : "") + ">" +
                          (beat[i][j] % 2 == 1 ? (beat[i][j] > 2 ? (beat[i][j] - 1) / 2 : "") + "&frac12;" : beat[i][j] / 2) + "</td><td" +
                          (beat[j][i] > beat[i][j] ? " class=\"win\"" : beat[j][i] < beat[i][j] ? " class=\"loss\"" : "") + ">" +
                          (beat[j][i] % 2 == 1 ? (beat[j][i] > 2 ? (beat[j][i] - 1) / 2 : "") + "&frac12;" : beat[j][i] / 2) + "</td><td" +
                          (beat[j][i] > beat[i][j] ? " class=\"win\"" : beat[j][i] < beat[i][j] ? " class=\"loss\"" : "") + "><span class=\"cand\">" +
                          beatstr[j][i] + "</span></td></tr>\n";
         str2 += "</table>\n" +
                 "<p>";
      }
      for (i in score)
         score[i] = 0;
      for (i in numtocand)
         for (j in numtocand)
            if (i != j && beat[i][j] > beat[j][i])
               ++score[j];
      for (i in score)
         if (score[i] == 0)
            winset[winset.length] = i;
      if (winset.length > 0)
         break;
      if (onlyone)
         str2 += "Each candidate loses a beatpath comparison, so the beatpaths are expanded by one.</p>\n";
      for (i in beat)
         for (j in beat[i])
            beatold[i][j] = beat[i][j];
      for (i in beatstr)
         for (j in beatstr[i])
            beatstrold[i][j] = beatstr[i][j];
      for (i in numtocand)
         for (j in numtocand)
            if (i != j)
               for (k in numtocand)
                  if (i != k && j != k && beat[i][j] < beatold[i][k] && beat[i][j] < pvote[k][j])
                  {
                     beat[i][j] = beatold[i][k] < pvote[k][j] ? beatold[i][k] : pvote[k][j];
                     beatstr[i][j] = beatstrold[i][k] + ">" + numtocand[j];
                  }
   }
   if (winset.length == 1)
   {
      result.winner = numtocand[winset[0]];
      result.tiebreak = false;
      if (onlyone)
         str2 += "<span class=\"cand\">" + result.winner +
                 "</span> is the only candidate to lose no beatpath comparisons and so wins the election outright.</p>\n";
   }
   else
   {
      result.winner = winset[0];
      for (i in winset)
         if (numtotb[winset[i]] < numtotb[result.winner])
            result.winner = winset[i];
      result.winner = numtocand[result.winner];
      result.tiebreak = true;
      if (onlyone)
      {
         if (winset.length == numtocand.length)
            str2 += "All of the candidates";
         else
            for (i in winset)
               str2 += "<span class=\"cand\">" + numtocand[winset[i]] + "</span>" +
                       (i == winset.length - 2 ? " and " : i == winset.length - 1 ? "" : ", ");
         str2 += " lose no beatpath comparisons, so a random-ballot tiebreaker must be used:</p>\n" +
                 "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                 "<p><span class=\"cand\">" + result.winner + "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
      }
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the LeGrand election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
} */
function calcnans(onlyone)
{
   var consider = new Array(), elimset, i, j, nconsider, result = new Object(), score = new Array(), str1, str2;
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Nanson election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Nanson election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote) +
             "<p>A candidate&rsquo;s Borda score can be found by subtracting its column sum from its row sum.</p>\n" +
             "<p>The candidates&rsquo; Borda scores:</p>\n";
   }
   for (i in numtocand)
   {
      consider[consider.length] = true;
      score[score.length] = 0;
   }
   nconsider = numtocand.length;
   result.tiebreak = false;
   while (true)
   {
      for (i in pvote)
         if (consider[i])
         {
            score[i] = 0;
            for (j in pvote[i])
               if (i != j && consider[j])
                  score[i] += pvote[i][j] - pvote[j][i];
         }
      if (onlyone)
      {
         str2 += "<table border cellpadding=3>\n";
         for (i in numtocand)
            if (consider[i])
               str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" + score[i] / 2 + "</td></tr>\n";
         str2 += "</table>\n" +
                 "<p>";
      }
      elimset = new Array();
      for (i in score)
         if (consider[i])
            if (score[i] < 0)
               elimset[elimset.length] = i;
      if (elimset.length == 0)
         for (i in score)
            if (consider[i])
               if (score[i] <= 0)
                  elimset[elimset.length] = i;
      if (elimset.length == nconsider)
         break;
      for (i in elimset)
      {
         consider[elimset[i]] = false;
         --nconsider;
         if (onlyone)
            str2 += "<span class=\"cand\">" + numtocand[elimset[i]] + "</span>" +
                    (i == elimset.length - 2 ? " and " : i == elimset.length - 1 ? "" : ", ");
      }
      if (onlyone)
         str2 += (elimset.length == 1 ? " has a negative Borda score and so is" : " have negative Borda scores and so are") + " eliminated.</p>\n";
      if (nconsider <= 1)
         break;
      if (onlyone)
         str2 += "<p>The reduced pairwise matrix:</p>\n" +
                 printpmatrix(pvote, consider) +
                 "<p>The candidates&rsquo; new Borda scores:</p>\n";
   }
   if (nconsider > 1)
   {
      result.winner = elimset[0];
      for (i in elimset)
         if (numtotb[elimset[i]] < numtotb[result.winner])
            result.winner = elimset[i];
      result.winner = numtocand[result.winner];
      result.tiebreak = true;
      if (onlyone)
         str2 += "All of the " + (nconsider == numtocand.length ? "" : "remaining ") +
                 "candidates have equal Borda scores, so a random-ballot tiebreaker must be used:</p>\n" +
                 "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                 "<p><span class=\"cand\">" + result.winner + "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
   }
   else
   {
      for (i in consider)
         if (consider[i])
            result.winner = numtocand[i];
      str2 += "<p><span class=\"cand\">" + result.winner + "</span> is the only remaining candidate and so wins the election outright.</p>\n";
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Nanson election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calcrayn(onlyone)
{
   var consider = new Array(), elim, elimset, i, j, nconsider, result = new Object(), score = new Array(), str1, str2, worstscore;
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Raynaud election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Raynaud election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote) +
             "<p>A candidate&rsquo;s Simpson score is the fewest number of votes it received in any single pairwise comparison.</p>\n" +
             "<p>The candidates&rsquo; Simpson scores:</p>\n";
   }
   for (i in numtocand)
   {
      consider[consider.length] = true;
      score[score.length] = Number.MAX_VALUE;
   }
   nconsider = numtocand.length;
   result.tiebreak = false;
   while (true)
   {
      for (i in pvote)
         if (consider[i])
         {
            score[i] = Number.MAX_VALUE;
            for (j in pvote[i])
               if (i != j && consider[j] && pvote[i][j] < score[i])
                  score[i] = pvote[i][j];
         }
      if (onlyone)
      {
         str2 += "<table border cellpadding=3>\n";
         for (i in numtocand)
            if (consider[i])
               str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" +
                       (score[i] % 2 == 1 ? (score[i] > 2 ? (score[i] - 1) / 2 : "") + "&frac12;" : score[i] / 2) + "</td></tr>\n";
         str2 += "</table>\n" +
                 "<p>";
      }
      worstscore = Number.MAX_VALUE;
      for (i in score)
         if (consider[i])
            if (score[i] < worstscore)
               worstscore = score[i];
      elimset = new Array();
      for (i in score)
         if (consider[i])
            if (score[i] == worstscore)
               elimset[elimset.length] = i;
      elim = elimset[0];
      if (elimset.length == 1)
      {
         if (onlyone)
            str2 += "<span class=\"cand\">" + numtocand[elim] + "</span> has the single worst Simpson score and so is eliminated.</p>\n";
      }
      else
      {
         for (i in elimset)
            if (numtotb[elimset[i]] > numtotb[elim])
               elim = elimset[i];
         result.tiebreak = true;
         if (onlyone)
         {
            if (elimset.length == nconsider)
               str2 += "All of the candidates";
            else
               for (i in elimset)
                  str2 += "<span class=\"cand\">" + numtocand[elimset[i]] + "</span>" +
                          (i == elimset.length - 2 ? " and " : i == elimset.length - 1 ? "" : ", ");
            str2 += " have equally worst Simpson scores, so a random-ballot tiebreaker must be used:</p>\n" +
                    "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                    "<p><span class=\"cand\">" + numtocand[elim] + "</span> is the lowest of them in the tiebreaking ranking and so is eliminated.</p>\n";
         }
      }
      consider[elim] = false;
      --nconsider;
      if (nconsider <= 1)
         break;
      if (onlyone)
         str2 += "<p>The reduced pairwise matrix:</p>\n" +
                 printpmatrix(pvote, consider) +
                 "<p>The candidates&rsquo; new Simpson scores:</p>\n";
   }
   for (i in consider)
      if (consider[i])
         result.winner = numtocand[i];
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Raynaud election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "<p><span class=\"cand\">" + result.winner + "</span> is the only remaining candidate and so wins the election.</p>\n" +
              "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calcschu(onlyone)
{
   var beat = new Array(), beatstr = new Array(), i, j, k, result = new Object(), score = new Array(), str1, str2, winset = new Array();
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Schulze election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Schulze election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote) +
             "<p>Comparisons of strongest beatpaths for each pair of candidates:</p>\n";
   }
   for (i in pvote)
   {
      beat[beat.length] = new Array();
      beatstr[beatstr.length] = new Array();
      for (j in pvote[i])
      {
         beat[i][beat[i].length] = pvote[i][j];
         beatstr[i][beatstr[i].length] = numtocand[i] + ">" + numtocand[j];
      }
      score[score.length] = 0;
   }
   for (i in numtocand)
      for (j in numtocand)
         if (i != j)
            for (k in numtocand)
               if (i != k && j != k && beat[j][k] < beat[j][i] && beat[j][k] < beat[i][k])
               {
                  beat[j][k] = beat[j][i] < beat[i][k] ? beat[j][i] : beat[i][k];
                  beatstr[j][k] = beatstr[j][i] + beatstr[i][k].replace(/^[^>]+/, "");
               }
   if (onlyone)
   {
      str2 += "<table border cellpadding=3>\n";
      for (i in numtocand)
         for (j in numtocand)
            if (i < j)
               str2 += "<tr align=\"center\"><td" + (beat[i][j] > beat[j][i] ? " class=\"win\"" : beat[i][j] < beat[j][i] ? " class=\"loss\"" : "") +
                       "><span class=\"cand\">" + beatstr[i][j] + "</span></td><td" +
                       (beat[i][j] > beat[j][i] ? " class=\"win\"" : beat[i][j] < beat[j][i] ? " class=\"loss\"" : "") + ">" +
                       (beat[i][j] % 2 == 1 ? (beat[i][j] > 2 ? (beat[i][j] - 1) / 2 : "") + "&frac12;" : beat[i][j] / 2) + "</td><td" +
                       (beat[j][i] > beat[i][j] ? " class=\"win\"" : beat[j][i] < beat[i][j] ? " class=\"loss\"" : "") + ">" +
                       (beat[j][i] % 2 == 1 ? (beat[j][i] > 2 ? (beat[j][i] - 1) / 2 : "") + "&frac12;" : beat[j][i] / 2) + "</td><td" +
                       (beat[j][i] > beat[i][j] ? " class=\"win\"" : beat[j][i] < beat[i][j] ? " class=\"loss\"" : "") + "><span class=\"cand\">" +
                       beatstr[j][i] + "</span></td></tr>\n";
      str2 += "</table>\n" +
              "<p>";
   }
   for (i in numtocand)
      for (j in numtocand)
         if (i != j && beat[i][j] > beat[j][i])
            ++score[j];
   for (i in score)
      if (score[i] == 0)
         winset[winset.length] = i;
   if (winset.length == 1)
   {
      result.winner = numtocand[winset[0]];
      result.tiebreak = false;
      if (onlyone)
         str2 += "<span class=\"cand\">" + result.winner +
                 "</span> is the only candidate to lose no beatpath comparisons and so wins the election outright.</p>\n";
   }
   else
   {
      result.winner = winset[0];
      for (i in winset)
         if (numtotb[winset[i]] < numtotb[result.winner])
            result.winner = winset[i];
      result.winner = numtocand[result.winner];
      result.tiebreak = true;
      if (onlyone)
      {
         if (winset.length == numtocand.length)
            str2 += "All of the candidates";
         else
            for (i in winset)
               str2 += "<span class=\"cand\">" + numtocand[winset[i]] + "</span>" +
                       (i == winset.length - 2 ? " and " : i == winset.length - 1 ? "" : ", ");
         str2 += " lose no beatpath comparisons, so a random-ballot tiebreaker must be used:</p>\n" +
                 "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                 "<p><span class=\"cand\">" + result.winner + "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
      }
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Schulze election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calcsimp(onlyone)
{
   var bestscore = -Number.MAX_VALUE, i, j, result = new Object(), score = new Array(), str1, str2, winset = new Array();
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Simpson election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Simpson election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote) +
             "<p>A candidate&rsquo;s Simpson score is the fewest number of votes it received in any single pairwise comparison.</p>\n" +
             "<p>The candidates&rsquo; Simpson scores:</p>\n" +
             "<table border cellpadding=3>\n";
   }
   for (i in pvote)
   {
      score[score.length] = Number.MAX_VALUE;
      for (j in pvote[i])
         if (i != j && pvote[i][j] < score[i])
            score[i] = pvote[i][j];
   }
   if (onlyone)
   {
      for (i in numtocand)
         str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" +
                 (score[i] % 2 == 1 ? (score[i] > 2 ? (score[i] - 1) / 2 : "") + "&frac12;" : score[i] / 2) + "</td></tr>\n";
      str2 += "</table>\n" +
              "<p>";
   }
   for (i in score)
      if (score[i] > bestscore)
         bestscore = score[i];
   for (i in score)
      if (score[i] == bestscore)
         winset[winset.length] = i;
   if (winset.length == 1)
   {
      result.winner = numtocand[winset[0]];
      result.tiebreak = false;
      if (onlyone)
         str2 += "<span class=\"cand\">" + result.winner + "</span> has the single best Simpson score and so wins the election outright.</p>\n";
   }
   else
   {
      result.winner = winset[0];
      for (i in winset)
         if (numtotb[winset[i]] < numtotb[result.winner])
            result.winner = winset[i];
      result.winner = numtocand[result.winner];
      result.tiebreak = true;
      if (onlyone)
      {
         if (winset.length == numtocand.length)
            str2 += "All of the candidates";
         else
            for (i in winset)
               str2 += "<span class=\"cand\">" + numtocand[winset[i]] + "</span>" +
                       (i == winset.length - 2 ? " and " : i == winset.length - 1 ? "" : ", ");
         str2 += " have equally best Simpson scores, so a random-ballot tiebreaker must be used:</p>\n" +
                 "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                 "<p><span class=\"cand\">" + result.winner + "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
      }
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Simpson election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calcsmal(onlyone)
{
   var bestscore, consider = new Array(), elimset, i, j, nconsider, result = new Object(), score = new Array(), str1, str2;
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Small election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Small election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote) +
             "<p>A candidate&rsquo;s Copeland score is the number of its pairwise victories, where a pairwise tie counts as half a victory.</p>\n" +
             "<p>The candidates&rsquo; Copeland scores:</p>\n";
   }
   for (i in numtocand)
   {
      consider[consider.length] = true;
      score[score.length] = 0;
   }
   nconsider = numtocand.length;
   result.tiebreak = false;
   while (true)
   {
      for (i in pvote)
         score[i] = 0;
      for (i in pvote)
         if (consider[i])
            for (j in pvote[i])
               if (i != j && consider[j])
                  if (pvote[i][j] > pvote[j][i])
                     score[i] += 2;
                  else if (pvote[i][j] == pvote[j][i])
                     ++score[i];
      if (onlyone)
      {
         str2 += "<table border cellpadding=3>\n";
         for (i in numtocand)
            if (consider[i])
               str2 += "<tr align=\"center\"><td><span class=\"cand\">" + numtocand[i] + "</span></td><td>" +
                       (score[i] % 2 == 1 ? (score[i] > 2 ? (score[i] - 1) / 2 : "") + "&frac12;" : score[i] / 2) + "</td></tr>\n";
         str2 += "</table>\n" +
                 "<p>";
      }
      bestscore = 0;
      for (i in score)
         if (score[i] > bestscore)
            bestscore = score[i];
      elimset = new Array();
      for (i in score)
         if (consider[i])
            if (score[i] < bestscore)
               elimset[elimset.length] = i;
      if (elimset.length == 0)
         for (i in score)
            if (consider[i])
               if (score[i] <= bestscore)
                  elimset[elimset.length] = i;
      if (elimset.length == nconsider)
         break;
      for (i in elimset)
      {
         consider[elimset[i]] = false;
         --nconsider;
         if (onlyone)
            str2 += "<span class=\"cand\">" + numtocand[elimset[i]] + "</span>" +
                    (i == elimset.length - 2 ? " and " : i == elimset.length - 1 ? "" : ", ");
      }
      if (onlyone)
         str2 += (elimset.length == 1 ? " has a non-best Copeland score and so is" : " have non-best Copeland scores and so are") + " eliminated.</p>\n";
      if (nconsider <= 1)
         break;
      if (onlyone)
         str2 += "<p>The reduced pairwise matrix:</p>\n" +
                 printpmatrix(pvote, consider) +
                 "<p>The candidates&rsquo; new Copeland scores:</p>\n";
   }
   if (nconsider > 1)
   {
      result.winner = elimset[0];
      for (i in elimset)
         if (numtotb[elimset[i]] < numtotb[result.winner])
            result.winner = elimset[i];
      result.winner = numtocand[result.winner];
      result.tiebreak = true;
      if (onlyone)
         str2 += "All of the " + (nconsider == numtocand.length ? "" : "remaining ") +
                 "candidates have equal Copeland scores, so a random-ballot tiebreaker must be used:</p>\n" +
                 "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n" +
                 "<p><span class=\"cand\">" + result.winner + "</span> is the highest of them in the tiebreaking ranking and so wins the election.</p>\n";
   }
   else
   {
      for (i in consider)
         if (consider[i])
            result.winner = numtocand[i];
      str2 += "<p><span class=\"cand\">" + result.winner + "</span> is the only remaining candidate and so wins the election outright.</p>\n";
   }
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Small election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function calctide(onlyone)
{
   var beat = new Array(), beatall, highest, i, j, k, l, loser, nclear, ncontra, nimplied, result = new Object(), seen = new Array(), str1, str2;
   if (onlyone)
   {
      if (!readvotes())
         return;
      str1 = "<html><head><title>Tideman election results</title>\n" +
             "<link href=\"style.css\" rel=\"stylesheet\" type=\"text/css\"></head>\n" +
             "<body bgcolor=\"#c0c8d0\" text=\"#000000\">\n" +
             "<h1>Tideman election results</h1>\n";
      str2 = "<p>The ranked ballots:</p>\n" +
             printrvote() +
             "<p>The pairwise matrix:</p>\n" +
             printpmatrix(pvote);
   }
   for (i in pvote)
   {
      beat[beat.length] = new Array();
      seen[seen.length] = new Array();
      for (j in pvote[i])
         beat[i][beat[i].length] = seen[i][seen[i].length] = false;
   }
   result.tiebreak = false;
bigloop:
   while (true)
   {
      highest = nclear = ncontra = nimplied = 0;
      for (i in numtocand)
         for (j in numtocand)
            if (i != j && !seen[i][j])
               if (pvote[i][j] > highest)
                  highest = pvote[i][j];
      for (i in numtocand)
         for (j in numtocand)
            if (i != j && !seen[i][j] && pvote[i][j] == highest)
            {
               if (beat[i][j] && !beat[j][i])
                  ++nimplied;
               if (!beat[i][j] && beat[j][i])
                  ++ncontra;
               if (!beat[i][j] && !beat[j][i])
                  ++nclear;
            }
      if (nimplied > 0)
         for (i in numtocand)
            for (j in numtocand)
               if (i != j && !seen[i][j] && pvote[i][j] == highest && beat[i][j])
               {
                  if (onlyone)
                     str2 += "<p><span class=\"cand\">" + numtocand[i] + "&gt;" + numtocand[j] + "</span> has a strength of " +
                             (highest % 2 == 1 ? (highest - 1) / 2 + "&frac12;" : highest / 2) + " but is already locked.</p>\n";
                  seen[i][j] = true;
               }
      if (ncontra > 0)
         for (i in numtocand)
            for (j in numtocand)
               if (i != j && !seen[i][j] && pvote[i][j] == highest && beat[j][i])
               {
                  if (onlyone)
                     str2 += "<p><span class=\"cand\">" + numtocand[i] + "&gt;" + numtocand[j] + "</span> has a strength of " +
                             (highest % 2 == 1 ? (highest - 1) / 2 + "&frac12;" : highest / 2) + " but <span class=\"cand\">" + numtocand[j] + "&gt;" +
                             numtocand[i] + "</span> is already locked.</p>\n";
                  seen[i][j] = true;
               }
      if (nclear > 0)
      {
         if (nclear > 1)
         {
            result.tiebreak = true;
            if (onlyone)
            {
               str2 += "<p>";
               for (i in numtocand)
                  for (j in numtocand)
                     if (i != j && !seen[i][j] && pvote[i][j] == highest)
                        str2 += "<span class=\"cand\">" + numtocand[i] + "&gt;" + numtocand[j] + "</span>" +
                                (--nclear > 1 ? ", " : nclear > 0 ? " and " : " have a strength of ");
               str2 += (highest % 2 == 1 ? (highest - 1) / 2 + "&frac12;" : highest / 2) + ", so a random-ballot tiebreaker must be used:</p>\n" +
                       "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + printtiebreak(tbtonum) + "</p>\n";
            }
            loser = new Array();
            for (i in numtocand)
               loser[loser.length] = false;
            for (i in numtocand)
               for (k in numtocand)
                  if (i != k && !seen[i][k] && pvote[i][k] == highest)
                  {
                     loser[k] = true;
                     j = k;
                  }
            ncontra = 0;
            for (i in loser)
               if (loser[i])
               {
                  if (numtotb[i] > numtotb[j])
                     j = i;
                  ++ncontra;
               }
            loser = new Array();
            for (i in numtocand)
               loser[loser.length] = false;
            for (k in numtocand)
               if (j != k && !seen[k][j] && pvote[k][j] == highest)
               {
                  loser[k] = true;
                  i = k;
               }
            nimplied = 0;
            for (k in loser)
               if (loser[k])
               {
                  if (numtotb[i] > numtotb[k])
                     i = k;
                  ++nimplied;
               }
            if (onlyone)
            {
               if (ncontra > 1)
                  str2 += "<p>Of the losers of each comparison, <span class=\"cand\">" + numtocand[j] +
                          "</span> is the lowest in the tiebreaking ranking.</p>\n";
               if (nimplied > 1)
                  str2 += "<p>Of the winners of each " + (ncontra > 1 ? "defeat of <span class=\"cand\">" + numtocand[j] + "</span>" : "comparison") +
                          ", <span class=\"cand\">" + numtocand[i] + "</span> is the highest in the tiebreaking ranking.</p>\n";
            }
            seen[i][j] = true;
            if (onlyone)
               str2 += "<p><span class=\"cand\"><strong>" + numtocand[i] + "&gt;" + numtocand[j] +
                       "</strong></span> wins the tiebreaker and so is locked.</p>\n";
         }
         else
         {
findloop:
            for (i in numtocand)
               for (j in numtocand)
                  if (i != j && !seen[i][j] && pvote[i][j] == highest)
                     break findloop;
            if (i == j || seen[i][j] || pvote[i][j] != highest)
               continue bigloop;
            seen[i][j] = true;
            if (onlyone)
               str2 += "<p><span class=\"cand\"><strong>" + numtocand[i] + "&gt;" + numtocand[j] + "</strong></span> has a strength of " +
                      (highest % 2 == 1 ? (highest - 1) / 2 + "&frac12;" : highest / 2) + " and so is locked.</p>\n";
         }
         beat[i][j] = beatall = true;
         for (k in numtocand)
            if (i != k && !beat[i][k])
               beatall = false;
         if (beatall)
         {
            result.winner = numtocand[i];
            break bigloop;
         }
         for (i in numtocand)
            for (j in numtocand)
               if (i != j)
                  for (k in numtocand)
                     if (j != k && beat[i][k] && beat[j][i] && !beat[j][k])
                     {
                        if (onlyone)
                           str2 += "<p><span class=\"cand\"><strong>" + numtocand[j] + "&gt;" + numtocand[k] +
                                   "</strong></span> is implied by <span class=\"cand\">" + numtocand[j] + "&gt;" + numtocand[i] +
                                   "</span> and <span class=\"cand\">" + numtocand[i] + "&gt;" + numtocand[k] + "</span> and so is locked.</p>\n";
                        beat[j][k] = beatall = true;
                        for (l in numtocand)
                           if (j != l && !beat[j][l])
                              beatall = false;
                        if (beatall)
                        {
                           result.winner = numtocand[j];
                           break bigloop;
                        }
                     }
      }
   }
   if (onlyone)
      str2 += "<p><span class=\"cand\">" + result.winner + "</span> has locked victories over all other candidates and so wins the election.</p>\n";
   if (onlyone)
   {
      str1 += "<table border cellpadding=3><tr><td><span class=\"cand\">" + result.winner + "</span> wins the Tideman election" +
              (result.tiebreak ? " using the tiebreaking ranking " + printtiebreak(tbtonum) : "") + ".</td></tr></table>\n";
      str2 += "</body></html>";
      document.write(str1 + str2);
      document.close();
   }
   else
      return result;
}
function printpmatrix(pmatrix, consider)
{
   var firstcand = true, i, j, nconsider = 0, str;
   if (typeof consider != "object")
   {
      consider = new Array();
      for (i in numtocand)
         consider[consider.length] = true;
   }
   for (i in consider)
      if (consider[i])
         ++nconsider;
   if (nconsider == 0)
      return "<p><em>Error!&nbsp; No candidate left!</em></p>";
   else if (nconsider == 1)
      return "<p><em>Error!&nbsp; Only one candidate left!</em></p>";
   str = "<p><table border cellpadding=3>\n" +
         "<tr align=\"center\"><td colspan=2 rowspan=2></td><th colspan=" + nconsider + ">against</th></tr>\n" +
         "<tr align=\"center\">";
   for (i in pmatrix)
      if (consider[i])
         str += "<td class=\"against\"><span class=\"cand\">" + numtocand[i] + "</span></td>";
   str += "</tr>\n";
   for (i in pmatrix)
      if (consider[i])
      {
         str += "<tr align=\"center\">";
         if (firstcand)
         {
            firstcand = false;
            str += "<th rowspan=" + nconsider + ">for</th>";
         }
         str += "<td class=\"for\"><span class=\"cand\">" + numtocand[i] + "</span></td>";
         for (j in pmatrix[i])
            if (consider[j])
               str += "<td" +
                      (pmatrix[i][j] > pmatrix[j][i] ? " class=\"win\">" : pmatrix[i][j] < pmatrix[j][i] ? " class=\"loss\">" : ">") +
                      (i == j ? "" : pmatrix[i][j] % 2 == 1 ? (pmatrix[i][j] > 2 ? (pmatrix[i][j] - 1) / 2 : "") + "&frac12;" : pmatrix[i][j] / 2) +
                      (pmatrix[i][j] > pmatrix[j][i] ? "</strong>" : "") + "</td>";
         str += "</tr>\n";
      }
   return str + "</table></p>\n";
}
function printrvote(consider)
{
   var i, j, nconsider = 0, str;
   if (typeof consider != "object")
   {
      consider = new Array();
      for (i in numtocand)
         consider[consider.length] = true;
   }
   for (i in consider)
      if (consider[i])
         ++nconsider;
   if (nconsider == 0)
      return "<p><em>Error!&nbsp; No candidate left!</em></p>";
   else if (nconsider == 1)
      return "<p><em>Error!&nbsp; Only one candidate left!</em></p>";
   str = "<p><table border=0 cellpadding=0 cellspacing=0>\n";
   for (i in rvote)
   {
      str += "<tr align=\"right\"><td><span class=\"cand\">" + rvotenum[i] + ":";
      for (j in rvotetie[i])
         if (consider[rvote[i][j]])
            str += numtocand[rvote[i][j]] + (rvotetie[i][j] ? "=" : "&gt;");
      if (consider[rvote[i][rvote[i].length - 1]])
         str += numtocand[rvote[i][rvote[i].length - 1]];
      else
         str = str.replace(/&gt;$/, "");
      str += "</span></td></tr>\n";
   }
   return str + "</table></p>\n";
}

const printtiebreak = (tbtonum) => (
   '<span class="cand">'
   + tbtonum.map(
      num => numtocand[num]
   ).join('&gt;')
   + '</span>'
);

function readvotes()
{
   var absent, beat = new Array(), i, ignoreinput, j, k, l, nextcand, rating = new Array(), regexp = new RegExp(), rvotecomment, rvoteinput,
       rvoteline = new Array(), tiebreakinput;
   rvoteinput = document.rbform.rvote.value.replace(/[\f\r\v]/g, "\n") + "\n";
   rvoteinput = rvoteinput.replace(/[\t\n ]+\n/g, "\n");
   rvoteinput = rvoteinput.replace(/^\n/, "");
   rvoteinput = rvoteinput.replace(/\n$/, "");
   if (!/\S/.test(rvoteinput))
   {
      document.rbform.rvote.value = "";
      alert("No input was detected.  Please enter ranked ballots and try again.");
      return false;
   }
   rvoteline = rvoteinput.split("\n");
   rvotecomment = rvoteinput.split("\n");
   for (i = 0; i < rvoteline.length; ++i)
   {
      rvoteline[i] = rvoteline[i].replace(/[\t\n ]*#.*$/, "");
      if (/\S/.test(rvoteline[i]))
      {
         rvoteline[i] = rvoteline[i].replace(/[^\t \d:=>A-Za-z]/g, "?");
         if (!/\?/.test(rvoteline[i]) && !/^[\t ]*(\d+[\t ]*:[\t ]*)?[A-Za-z]+([\t ]*[=>][\t ]*[A-Za-z]+)*$/.test(rvoteline[i]))
            rvoteline[i] = "!" + rvoteline[i];
      }
      rvotecomment[i] = /#/.test(rvotecomment[i]) ? "#" + rvotecomment[i].replace(/^[^#]*#/, "") : "";
   }
   rvoteinput = "";
   for (i = 0; i < rvoteline.length; ++i)
   {
      if (i > 0)
         rvoteinput += "\n";
      rvoteinput += rvoteline[i] + (rvoteline[i].length && rvotecomment[i].length ? " " : "") + rvotecomment[i];
   }
   document.rbform.rvote.value = rvoteinput;
   for (i in rvoteline)
   {
      rvoteline[i] = rvoteline[i].replace(/[\t ]+/g, "");
      if (/\w/.test(rvoteline[i]) && !/:/.test(rvoteline[i]))
         rvoteline[i] = "1:" + rvoteline[i];
   }
   rvoteinput = rvoteline.join("\n");
   if (!/\S/.test(rvoteinput))
   {
      alert("No input was detected.  Please enter or uncomment ranked ballots and try again.");
      return false;
   }
   if (/\?/.test(rvoteinput))
   {
      alert("Illegal characters were detected and replaced with question marks.  The only legal characters (except inside comments) are letters, " +
            "digits, :, >, = and whitespace.  Please correct the ranked ballots and try again.");
      return false;
   }
   if (/!/.test(rvoteinput))
   {
      alert("Badly-formed lines were detected and marked with exclamation points.  Please correct the ranked ballots and try again; see below for " +
            "examples.");
      return false;
   }
   rvoteinput = rvoteinput.replace(/\n\n+/g, "\n");
   rvoteinput = rvoteinput.replace(/^\n+/, "");
   rvoteinput = rvoteinput.replace(/\n+$/, "");
   rvoteline = rvoteinput.split("\n");
   tiebreakinput = document.rbform.tiebreak.value.replace(/[^>A-Za-z]/g, ">");
   tiebreakinput = tiebreakinput.replace(/>>+/g, ">");
   tiebreakinput = tiebreakinput.replace(/^>/, "");
   document.rbform.tiebreak.value = tiebreakinput = tiebreakinput.replace(/>$/, "");
   ignoreinput = document.rbform.ignore.value.replace(/[^A-Za-z]/g, " ");
   ignoreinput = ignoreinput.replace(/\s\s+/g, " ");
   ignoreinput = ignoreinput.replace(/^\s/, "");
   document.rbform.ignore.value = ignoreinput = ignoreinput.replace(/\s$/, "");
   if (ignoreinput.length > 0)
   {
      ignoreinput = ignoreinput.match(/[A-Za-z]+/g);
      for (i in rvoteline)
      {
         rvoteline[i] = rvoteline[i].replace(/:/, ": ") + " ";
         rvoteline[i] = rvoteline[i].replace(/>/g, " > ");
         rvoteline[i] = rvoteline[i].replace(/=/g, " = ");
         for (j in ignoreinput)
         {
            regexp.compile(" " + ignoreinput[j] + " =", "g");
            rvoteline[i] = rvoteline[i].replace(regexp, " ");
            regexp.compile("= " + ignoreinput[j] + " ", "g");
            rvoteline[i] = rvoteline[i].replace(regexp, " ");
            regexp.compile(" " + ignoreinput[j] + " >", "g");
            rvoteline[i] = rvoteline[i].replace(regexp, " ");
            regexp.compile("> " + ignoreinput[j] + " ", "g");
            rvoteline[i] = rvoteline[i].replace(regexp, " ");
            regexp.compile(" " + ignoreinput[j] + " ", "g");
            rvoteline[i] = rvoteline[i].replace(regexp, " ");
         }
         rvoteline[i] = rvoteline[i].replace(/\s+/g, "");
      }
      rvoteinput = rvoteline.join("\n");
      tiebreakinput = ">" + tiebreakinput + ">";
      for (i in ignoreinput)
      {
         regexp.compile(">" + ignoreinput[i] + ">", "g");
         tiebreakinput = tiebreakinput.replace(regexp, ">");
      }
      tiebreakinput = tiebreakinput.replace(/^>/, "");
      tiebreakinput = tiebreakinput.replace(/>$/, "");
   }
   candtonum = new Object();
   numtocand = (rvoteinput + " " + tiebreakinput).match(/[A-Za-z]+/g);
   for (i = 0; i < numtocand.length; ++i)
      candtonum[numtocand[i]] = 0;
   numtocand = new Array();
   for (i in candtonum)
      numtocand[numtocand.length] = i;
   if (numtocand.length < 2)
   {
      alert("The election must include at least two candidates.  Please correct the ranked ballots and try again.");
      return false;
   }
   numtocand.sort();
   candtonum = new Object();
   for (i in numtocand)
      candtonum[numtocand[i]] = i;
   rvote = new Array();
   rvotenum = new Array();
   rvotetie = new Array();
   for (i = j = 0; i < rvoteline.length; ++i)
   {
      k = new Number(rvoteline[i].match(/\d+/)[0]);
      if (k <= 0)
         continue;
      rvotenum[rvotenum.length] = k;
      rvoteline[i] = " " + rvoteline[i].replace(/[\d:]+/g, "") + " ";
      rvoteline[i] = rvoteline[i].replace(/=/g, " = ");
      rvoteline[i] = rvoteline[i].replace(/>/g, " > ");
      rvote[rvote.length] = new Array();
      rvotetie[rvotetie.length] = new Array();
      while (/[A-Za-z]/.test(rvoteline[i]))
      {
         nextcand = rvoteline[i].match(/[A-Za-z]+/)[0];
         rvote[j][rvote[j].length] = candtonum[nextcand];
         rvotetie[j][rvotetie[j].length] = (rvoteline[i] + ">").match(/[=>]/)[0] == "=";
         regexp.compile(" " + nextcand + " =", "g");
         rvoteline[i] = rvoteline[i].replace(regexp, " ");
         regexp.compile("= " + nextcand + " ", "g");
         rvoteline[i] = rvoteline[i].replace(regexp, " ");
         regexp.compile(" " + nextcand + " >", "g");
         rvoteline[i] = rvoteline[i].replace(regexp, " ");
         regexp.compile("> " + nextcand + " ", "g");
         rvoteline[i] = rvoteline[i].replace(regexp, " ");
         regexp.compile(" " + nextcand + " ", "g");
         rvoteline[i] = rvoteline[i].replace(regexp, " ");
      }
      for (k in numtocand)
      {
         absent = true;
         for (l in rvote[j])
            if (rvote[j][l] == k)
               absent = false;
         if (absent)
         {
            rvote[j][rvote[j].length] = k;
            rvotetie[j][rvotetie[j].length] = true;
         }
      }
      rvotetie[j].pop();
      ++j;
   }
   if (j < 1)
   {
      alert("At least one ballot must have a nonzero count.  Please correct the ranked ballots and try again.");
      return false;
   }
   numtotb = new Array();
   tbtonum = new Array();
   for (i in numtocand)
      numtotb[numtotb.length] = 0;
   while (/[A-Za-z]/.test(tiebreakinput))
   {
      nextcand = tiebreakinput.match(/[A-Za-z]+/)[0];
      tbtonum[tbtonum.length] = candtonum[nextcand];
      regexp.compile(nextcand, "g");
      tiebreakinput = tiebreakinput.replace(regexp, "");
   }
   if (tbtonum.length == 0)
   {
      document.rbform.tiebreak.value = "";
      i = Math.random();
      i = Math.floor(i * rvote.length);
      for (j in rvote[i])
         tbtonum[tbtonum.length] = rvote[i][j];
   }
   if (tbtonum.length < numtocand.length)
   {
      alert("If given, the tiebreaking ranking must list all of the candidates.  Please either correct or delete it and try again.");
      return false;
   }
   if (document.rbform.reverse.checked)
   {
      for (i in rvote)
      {
         for (j = 0, k = rvote[i].length - 1; j < k; ++j, --k)
         {
            l = rvote[i][j];
            rvote[i][j] = rvote[i][k];
            rvote[i][k] = l;
         }
         for (j = 0, k = rvotetie[i].length - 1; j < k; ++j, --k)
         {
            l = rvotetie[i][j];
            rvotetie[i][j] = rvotetie[i][k];
            rvotetie[i][k] = l;
         }
      }
      for (i = 0, j = tbtonum.length - 1; i < j; ++i, --j)
      {
         k = tbtonum[i];
         tbtonum[i] = tbtonum[j];
         tbtonum[j] = k;
      }
   }
   for (i in tbtonum)
      numtotb[tbtonum[i]] = i;
   equalranks = false;
   for (i in rvotetie)
      for (j in rvotetie[i])
         if (rvotetie[i][j])
            equalranks = true;
   pvote = new Array();
   for (i in numtocand)
   {
      pvote[i] = new Array();
      for (j in numtocand)
         pvote[i][j] = 0;
   }
   for (i in rvote)
   {
      k = 0;
      for (j in rvote[i])
      {
         rating[rvote[i][j]] = k;
         if (j < rvotetie[i].length && !rvotetie[i][j])
            ++k;
      }
      for (j in numtocand)
         for (k in numtocand)
            if (j < k)
               if (rating[j] < rating[k])
                  pvote[j][k] += 2 * rvotenum[i];
               else if (rating[j] > rating[k])
                  pvote[k][j] += 2 * rvotenum[i];
               else
               {
                  pvote[j][k] += rvotenum[i];
                  pvote[k][j] += rvotenum[i];
               }
   }
   for (i in numtocand)
   {
      beat[beat.length] = new Array();
      for (j in numtocand)
         beat[i][beat[i].length] = i != j && pvote[i][j] > pvote[j][i];
      rating[i] = true;
   }
   for (i in beat)
      for (j in beat[i])
         if (i != j)
            for (k in numtocand)
               if (i != k && j != k && beat[i][k] && beat[j][i])
                  beat[j][k] = true;
   for (i in beat)
      for (j in beat[i])
         if (i != j && !beat[i][j] && beat[j][i])
            rating[i] = false;
   schwartz = new Array();
   for (i in numtocand)
      if (rating[i])
         schwartz[schwartz.length] = i;
   for (i in beat)
   {
      for (j in beat[i])
         if (i != j && pvote[i][j] == pvote[j][i])
            beat[i][j] = true;
      rating[i] = true;
   }
   for (i in beat)
      for (j in beat[i])
         if (i != j)
            for (k in numtocand)
               if (i != k && j != k && beat[i][k] && beat[j][i])
                  beat[j][k] = true;
   for (i in beat)
      for (j in beat[i])
         if (i != j && !beat[i][j] && beat[j][i])
            rating[i] = false;
   smith = new Array();
   for (i in numtocand)
      if (rating[i])
         smith[smith.length] = i;
   return true;
}
