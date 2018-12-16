$(document).ready(function() {


  $('.selector_mese').click(function() {
    $('.month_select').slideToggle()
  });
  $('.nation_select').mouseleave(function() {
    $('.nation_select').slideUp()
  });
  $('.month_select').mouseleave(function() {
    $('.month_select').slideUp()
  });

  //-----CAMBIO MESE CON FRECCETTE

  $('.fa-caret-left').click(function() {
    $('.mese .casella').remove()
    var mioMese = $('.nome_mese').find('h1').text()
    console.log(mioMese);
    $('.month_select .month').each(function(index) {
      console.log($(this).find('h1').text());
      if (mioMese == $(this).find('h1').text()) {
        var mioMeseScelto = $(this).prev().find('h1').text()
        console.log(mioMeseScelto);
        $('.nome_mese').find('h1').text(mioMeseScelto)
      }
    });
  });

  $('.fa-caret-right').click(function() {
    $('.mese .casella').remove()
    var mioMese = $('.nome_mese').find('h1').text()
    console.log(mioMese);
    $('.month_select .month').each(function(index) {
      console.log($(this).find('h1').text());
      if (mioMese == $(this).find('h1').text()) {
        var mioMeseScelto = $(this).next().find('h1').text()
        console.log(mioMeseScelto);
        $('.nome_mese').find('h1').text(mioMeseScelto)
      }
    });
  });

//--------------------------------



  $('.selector option').click(function() {
    var paese = $(this).val()
    console.log(paese);
    $('.nazione_scelta').text(paese)
    $('.selector_mese').show();
  });

  $('.month_select .month').click(function() {
    $('.mese .casella').remove()//devo usare remove e non hide perche poi sotto ho l index, e se nascondo e basta, l index continua a salire perche
    //continuano ad appendersi h1 che si sono nascosti, ma ci sono. se li rimuovo risolvo il problema.
    var mese = $(this).find('h1').text()
    console.log(mese);
    $('.nome_mese').find('h1').text(mese)
    var numero = $(this).index() + 1
    // console.log(numero);
    if (numero < 10) {
      var dataMese = '2017-0' + numero.toString()
      // console.log(dataMese);

    } else if (numero >= 10) {
      var dataMese = '2017-' + numero.toString()
      // console.log(dataMese);
    }
    var giorniMese = moment(dataMese).daysInMonth();
    // console.log(giorniMese);



    //una volta saputi i giorni del mese posso appenderli (elenco)
    // for (var i = 1; i <= giorniMese; i++) {
    //   $('.mese').append('<h1>' + i + '   ' + mese + '</h1>')
    // }

    //una volta saputi i giorni del mese posso appenderli (griglia)
    for (var i = 1; i <= giorniMese; i++) {
      var copia = $('.templates .casella').clone()
      $('.mese').append(copia)
      copia.find('h1').text(i + '   ' + mese)
    }

    //controllo che il mese selezionato non sia dopo il mese attuale
    var meseAtt = moment().format('YYYY-MM')
    var dataMeseSelezionato = moment(dataMese)
    console.log(dataMeseSelezionato);
    console.log(meseAtt);
    var differ = dataMeseSelezionato.diff(meseAtt, 'years')
    if (differ > 0) {
      alert('errore, il calendario non può prevedere festività future')
    }
    //----
    var nazione = $('.nazione_scelta').text()
    console.log(nazione);
    //per riuscire a far uscire la nazione dalla funzione jquery della selezione nazione,
    //rendendola accessibile dentro a questa funzione, l ho fatta scrivere da una parte e poi
    //l ho presa da li


    $.ajax({
      url: 'https://holidayapi.com/v1/holidays',
      type: 'GET',
      data: {
        key: '5f9acbbe-4c71-411f-9f20-722715eb40e2',
        country: nazione,
        year: 2017,
        month: numero
        //NB il parametro 'day' di questa api non e' il numero di giorni in un mese, bensi un giorno particolare in cui voglio cercare una festivita
      },
      success: function(data) {
      console.log("success");

      console.log(giorniMese);
      console.log(data.holidays);
      var ferie = data.holidays
      console.log(ferie.length);
      // console.log(data.holidays[1]['date']);

      //trasformo ogni giorno del mese in una stringa con la data scritta
      //nello stesso formato del database.
      //eseguo poi un controllo in cui se la data corrisponde con la data della festivita del db,
      //allora evidenzio il giorno corrispondente.

      var dateMese = []
      var data_1

      $('.mese h1').each(function(index, h1) {
        if (index < 9) {
          if (numero >= 10) {
            data_1 = '2017-' + numero + '-0' + (index + 1)
          } else if (numero < 10) {
            data_1 = '2017-0' + numero + '-0' + (index + 1)
          }
        } else if (index >= 9){
          if (numero >= 10) {
            data_1 = '2017-' + numero + '-' + (index + 1)
          } else if (numero < 10) {
            data_1 = '2017-0' + numero + '-' + (index + 1)
          }
        }
        var data_2 = data_1.toString();
        console.log(data_2)
        dateMese.push(data_2)
        for (var i = 0; i < ferie.length; i++) {
          if (data.holidays[i]['date'] === data_2) {
            console.log(this);
            $(this).addClass('red')
            $(this).siblings('h2').addClass('red')
            $(this).parent().addClass('sfondo')
            var testoIniz = $(this).text()
            var nomeFesta = data.holidays[i]['name']
            $(this).text(testoIniz + ': ')
            $(this).siblings('h2').text(nomeFesta)

          }
        }
      });
      console.log(dateMese);


      //------GIORNO DELLA SETTIMANA
      var weekDays = ['Dom','Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
      var giorniSettMese = []
      for (var i = 0; i < dateMese.length; i++) {
        var date = moment(dateMese[i]);
        var dow = date.day();
        console.log(dow);
        var giornoSett = weekDays[dow];
        console.log(giornoSett);
        giorniSettMese.push(giornoSett)
      }
      console.log(giorniSettMese);
      $('.mese .casella').each(function(index) {
        $(this).find('h3').text(giorniSettMese[index])
      });
      //-------
      $('.casella').mouseenter(function() {
        $('.casella').find('h1').css('margin-bottom', '0px');
        $(this).find('h1').css('margin-bottom', '10px');
      });
      //---------
      },
      error: function() {
      console.log("error");
      }
    })
  });

});




//5f9acbbe-4c71-411f-9f20-722715eb40e2 (api key per holidayapi)
