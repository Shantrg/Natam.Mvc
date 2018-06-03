
//============================================================================================ app_report_grid

app_report_grid = {

    allowEdit:0,
    reportType:0,
    area: '',
    source:
    {
        //sort: customsortfunc,
        datatype: "json",
        //id: 'PlotsId',
        type: 'POST',
        url: '/Building/GetReportGrid',
        //pagenum: 3,
        pagesize: 20,
        //root: 'Rows',
        //beforeprocessing: function (data) {
        //    this.totalrecords = data.TotalRows;
        //},
        //pager: function (pagenum, pagesize, oldpagenum) {
        //    // callback called when a page or page size is changed.
        //}
    },
   getGridFields: function (rt, area) {

        if (rt == "1")//--רשימת נכסים לפי אזור
        {
            if (area != '') {
                return [
                { name: 'קוד בניין', type: 'string' }
               , { name: 'שם בניין', type: 'string' }
               , { name: 'אזור', type: 'string' }
               , { name: 'עיר', type: 'string' }
               , { name: 'רחוב', type: 'string' }
               , { name: 'מס. בית', type: 'string' }
               , { name: 'שטח כולל', type: 'string' }
               , { name: 'שם בעלים', type: 'string' }
               , { name: 'טלפון בעלים', type: 'string' }
                , { name: 'איש קשר', type: 'string' }
                , { name: 'טלפון נייד', type: 'string' }
                , { name: 'דואל', type: 'string' }
            ];
            }
            else {
                return [
                { name: 'קוד בניין', type: 'string' }
               , { name: 'שם בניין', type: 'string' }
               , { name: 'אזור', type: 'string' }
               , { name: 'עיר', type: 'string' }
               , { name: 'רחוב', type: 'string' }
               , { name: 'מס. בית', type: 'string' }
               , { name: 'שטח כולל', type: 'string' }
               , { name: 'שם בעלים', type: 'string' }
               , { name: 'טלפון בעלים', type: 'string' }
               , { name: 'איש קשר', type: 'string' }
                , { name: 'טלפון נייד', type: 'string' }
                , { name: 'דואל', type: 'string' }
                ];
            }
        }
        else if (rt == "2")//--רשימת נכסים לפי עיר ורחוב
        {
            return [
            { name: 'קוד בניין', type: 'string' }
           , { name: 'שם בניין', type: 'string' }
           , { name: 'אזור', type: 'string' }
           , { name: 'עיר', type: 'string' }
           , { name: 'רחוב', type: 'string' }
           , { name: 'מס. בית', type: 'string' }
           , { name: 'שטח כולל', type: 'string' }
           , { name: 'שם בעלים', type: 'string' }
           , { name: 'טלפון בעלים', type: 'string' }
           , { name: 'איש קשר', type: 'string' }
           , { name: 'טלפון נייד', type: 'string' }
           , { name: 'דואל', type: 'string' }
            ];
        }
        else if (rt == "3")//--רשימת בעלים לפי אזור
        {
            if (area != '') {
                return [
                { name: 'קוד בניין', type: 'string' }
               , { name: 'שם בניין', type: 'string' }
               , { name: 'אזור', type: 'string' }
               , { name: 'עיר', type: 'string' }
               , { name: 'רחוב', type: 'string' }
               , { name: 'מס. בית', type: 'string' }
               , { name: 'שטח כולל', type: 'string' }
               , { name: 'שם בעלים', type: 'string' }
               , { name: 'טלפון בעלים', type: 'string' }
               , { name: 'שטח כולל לבעלים', type: 'string' }
               , { name: 'יחס באחוזים', type: 'string' }
               , { name: 'איש קשר', type: 'string' }
               , { name: 'טלפון נייד', type: 'string' }
               , { name: 'דואר אלקטרוני', type: 'string' }
               , { name: 'טלפון', type: 'string' }];
            }
            else {
                return [
                { name: 'קוד בניין', type: 'string' }
               , { name: 'שם בניין', type: 'string' }
               , { name: 'אזור', type: 'string' }
               , { name: 'עיר', type: 'string' }
               , { name: 'רחוב', type: 'string' }
               , { name: 'מס. בית', type: 'string' }
               , { name: 'שטח כולל', type: 'string' }
               , { name: 'שם בעלים', type: 'string' }
               , { name: 'טלפון בעלים', type: 'string' }
               , { name: 'שטח כולל לבעלים', type: 'string' }
               , { name: 'יחס באחוזים', type: 'string' }
               , { name: 'איש קשר', type: 'string' }
               , { name: 'טלפון נייד', type: 'string' }
               , { name: 'דואר אלקטרוני', type: 'string' }
               , { name: 'טלפון', type: 'string' }];
            }
        }
        else if (rt == "4")//--ביקושים של לקוחות
        {
            if (area != '') {
                return [
                { name: 'שם הסוכן', type: 'string' }
               , { name: 'אזור', type: 'string' }
               , { name: 'שטח מבוקש', type: 'string' }
               , { name: 'תאריך ביקוש', type: 'date' }];
            }
            else {
                return [
                { name: 'שם הסוכן', type: 'string' }
               , { name: 'אזור', type: 'string' }
               , { name: 'שטח מבוקש', type: 'string' }
               , { name: 'תאריך ביקוש', type: 'date' }];
            }
        }
        else if (rt == "5")//--דוח שטחים פנויים
        {
            if (area != '') {
                return [
                { name: 'קוד בניין', type: 'string' }
               , { name: 'שם בניין', type: 'string' }
               , { name: 'אזור', type: 'string' }
               , { name: 'עיר', type: 'string' }
               , { name: 'רחוב', type: 'string' }
               , { name: 'מס. בית', type: 'string' }
               , { name: 'סגו נכס', type: 'string' }
               , { name: 'שטח', type: 'string' }
               , { name: 'שם בעלים', type: 'string' }
               , { name: 'טלפון בעלים', type: 'string' }
            , { name: 'שם הסוכן', type: 'string' }
            , { name: 'תאריך עדכון אחרון', type: 'date' }
            , { name: 'Memo', type: 'string' }];
            }
            else {
                return [
                { name: 'קוד בניין', type: 'string' }
               , { name: 'שם בניין', type: 'string' }
               , { name: 'אזור', type: 'string' }
               , { name: 'עיר', type: 'string' }
               , { name: 'רחוב', type: 'string' }
               , { name: 'מס. בית', type: 'string' }
               , { name: 'סגו נכס', type: 'string' }
               , { name: 'שטח', type: 'string' }
             , { name: 'שם בעלים', type: 'string' }
             , { name: 'טלפון בעלים', type: 'string' }
            , { name: 'שם הסוכן', type: 'string' }
            , { name: 'תאריך עדכון אחרון', type: 'date' }
            , { name: 'Memo', type: 'string' }];
            }
        }
        else {
            return [];
        }
    },
   getGridColumns: function(rt){

        //dataField: 'CityName',  width: 120, cellsalign: 'right', align: 'center'
		
        if (rt == "1")//--רשימת נכסים לפי אזור
        {
            if (this.area != '') {
                return [
                { dataField: 'קוד בניין', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שם בניין', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'אזור', cellsalign: 'right', align: 'center', width: 200 }
               , { dataField: 'עיר', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'רחוב', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'מס. בית', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שטח כולל', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שם בעלים', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'טלפון בעלים', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'איש קשר', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'טלפון נייד', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'דואל', cellsalign: 'right', align: 'center', width: 150 }
                ];
            }
            else {
                return [
                { dataField: 'קוד בניין', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שם בניין', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'אזור', cellsalign: 'right', align: 'center', width: 200 }
               , { dataField: 'עיר', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'רחוב', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'מס. בית', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שטח כולל', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שם בעלים', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'טלפון בעלים', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'איש קשר', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'טלפון נייד', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'דואל', cellsalign: 'right', align: 'center', width: 150 }
                ];
            }
        }
        else if (rt == "2")//--רשימת נכסים לפי עיר ורחוב
        {
            return [
            { dataField: 'קוד בניין', cellsalign: 'right', align: 'center', width: 80 }
           , { dataField: 'שם בניין', cellsalign: 'right', align: 'center', width: 150 }
           , { dataField: 'אזור', cellsalign: 'right', align: 'center', width: 200 }
           , { dataField: 'עיר', cellsalign: 'right', align: 'center', width: 150 }
           , { dataField: 'רחוב', cellsalign: 'right', align: 'center', width: 150 }
           , { dataField: 'מס. בית', cellsalign: 'right', align: 'center', width: 80 }
           , { dataField: 'שטח כולל', cellsalign: 'right', align: 'center', width: 80 }
           , { dataField: 'שם בעלים', cellsalign: 'right', align: 'center', width: 150 }
           , { dataField: 'טלפון בעלים', cellsalign: 'right', align: 'center', width: 100 }
           , { dataField: 'איש קשר', cellsalign: 'right', align: 'center', width: 100 }
           , { dataField: 'טלפון נייד', cellsalign: 'right', align: 'center', width: 100 }
           , { dataField: 'דואל', cellsalign: 'right', align: 'center', width: 150 }
            ];
        }
        else if (rt == "3")//--רשימת בעלים לפי אזור
        {
            if (this.area != '') {
                return [
                { dataField: '#', cellsalign: 'right', align: 'center', width: 80, 'hidden': true }
               , { dataField: 'קוד בניין', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שם בניין', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'אזור', cellsalign: 'right', align: 'center', width: 200 }
               , { dataField: 'עיר', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'רחוב', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'מס. בית', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שטח כולל', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שם בעלים', cellsalign: 'right', align: 'center', width: 200 }
               , { dataField: 'טלפון בעלים', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'שטח כולל לבעלים', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'יחס באחוזים', cellsalign: 'right', align: 'center', cellsformat: 'p2', width: 80 }
               , { dataField: 'איש קשר', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'טלפון נייד', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'דואר אלקטרוני', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'טלפון', cellsalign: 'right', align: 'center', width: 100 }];
            }
            else {
                return [
                { dataField: '#', cellsalign: 'right', align: 'center', width: 80, 'hidden':true }
               ,{ dataField: 'קוד בניין', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שם בניין', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'אזור', cellsalign: 'right', align: 'center', width: 200 }
               , { dataField: 'עיר', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'רחוב', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'מס. בית', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שטח כולל', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שם בעלים', cellsalign: 'right', align: 'center', width: 200 }
               , { dataField: 'טלפון בעלים', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'שטח כולל לבעלים', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'יחס באחוזים', cellsalign: 'right', align: 'center', cellsformat: 'p2', width: 80 }
               , { dataField: 'איש קשר', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'טלפון נייד', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'דואר אלקטרוני', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'טלפון', cellsalign: 'right', align: 'center', width: 100 }];
            }
        }
        else if (rt == "4")//--ביקושים של לקוחות
        {
            if (this.area != '') {
                return [
                { dataField: 'שם הסוכן', cellsalign: 'right', align: 'center' }
               , { dataField: 'אזור', cellsalign: 'right', align: 'center' }
               , { dataField: 'שטח מבוקש', cellsalign: 'right', align: 'center' }
               , { dataField: 'תאריך ביקוש', cellsalign: 'right', align: 'center', type: 'date', cellsformat: 'd' }];
            }
            else {
                return [
                { dataField: 'שם הסוכן', cellsalign: 'right', align: 'center' }
               , { dataField: 'אזור', cellsalign: 'right', align: 'center' }
               , { dataField: 'שטח מבוקש', cellsalign: 'right', align: 'center' }
               , { dataField: 'תאריך ביקוש', cellsalign: 'right', align: 'center', type: 'date', cellsformat: 'd' }];
            }
        }
        else if (rt == "5")//--דוח שטחים פנויים
        {
            if (this.area != '') {
                return [
                { dataField: 'קוד בניין', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'שם בניין', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'אזור', cellsalign: 'right', align: 'center', width: 200 }
               , { dataField: 'עיר', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'רחוב', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'מס. בית', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'סוג נכס', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'שטח', cellsalign: 'right', align: 'center', width: 80 }
               , { dataField: 'שם בעלים', cellsalign: 'right', align: 'center', width: 200 }
               , { dataField: 'טלפון בעלים', cellsalign: 'right', align: 'center', width: 100 }
            , { dataField: 'שם הסוכן', cellsalign: 'right', align: 'center', width: 100 }
            , { dataField: 'תאריך עדכון אחרון', cellsalign: 'right', align: 'center', type: 'date', cellsformat: 'd', width:100 }
            , { dataField: 'Memo', cellsalign: 'right', align: 'center', width: 150 }];
            }
            else {
                return [
                { dataField: 'קוד בניין', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'שם בניין', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'אזור', cellsalign: 'right', align: 'center', width: 200 }
               , { dataField: 'עיר', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'רחוב', cellsalign: 'right', align: 'center', width: 150 }
               , { dataField: 'מס. בית', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'סוג נכס', cellsalign: 'right', align: 'center', width: 100 }
               , { dataField: 'שטח', cellsalign: 'right', align: 'center', width: 80 }
             , { dataField: 'שם בעלים', cellsalign: 'right', align: 'center', width: 200 }
             , { dataField: 'טלפון בעלים', cellsalign: 'right', align: 'center', width: 100 }
            , { dataField: 'שם הסוכן', cellsalign: 'right', align: 'center', width: 100 }
            , { dataField: 'תאריך עדכון אחרון', cellsalign: 'right', align: 'center', type: 'date', cellsformat: 'd', width:100 }
            , { dataField: 'Memo', cellsalign: 'right', align: 'center', width: 150 }];
            }
        }
        else {
            return [];
        }


   },
   getGridColumnList: function (rt) {

       if (rt == "1")//--רשימת נכסים לפי אזור
       {
           if (this.area != '') {
               return [
               { label: 'קוד בניין', checked: true }
              , { label: 'שם בניין', checked: true }
              , { label: 'אזור', checked: true }
              , { label: 'עיר', checked: true }
              , { label: 'רחוב', checked: true }
              , { label: 'מס. בית', checked: true }
              , { label: 'שטח כולל', checked: true }
              , { label: 'שם בעלים', checked: true }
              , { label: 'טלפון בעלים', checked: true }
              , { label: 'איש קשר', checked: true }
              , { label: 'טלפון נייד', checked: true }
              , { label: 'דואל', checked: true }
               ];
           }
           else {
               return [
               { label: 'קוד בניין', checked: true }
              , { label: 'שם בניין', checked: true }
              , { label: 'אזור', checked: true }
              , { label: 'עיר', checked: true }
              , { label: 'רחוב', checked: true }
              , { label: 'מס. בית', checked: true }
              , { label: 'שטח כולל', checked: true }
              , { label: 'שם בעלים', checked: true }
              , { label: 'טלפון בעלים', checked: true }
              , { label: 'איש קשר', checked: true }
              , { label: 'טלפון נייד', checked: true }
              , { label: 'דואל', checked: true }
               ];
           }
       }
       else if (rt == "2")//--רשימת נכסים לפי עיר ורחוב
       {
           return [
           { label: 'קוד בניין', checked: true }
          , { label: 'שם בניין', checked: true }
          , { label: 'אזור', checked: true }
          , { label: 'עיר', checked: true }
          , { label: 'רחוב', checked: true }
          , { label: 'מס. בית', checked: true }
          , { label: 'שטח כולל', checked: true }
          , { label: 'שם בעלים', checked: true }
          , { label: 'טלפון בעלים', checked: true }
          , { label: 'איש קשר', checked: true }
          , { label: 'טלפון נייד', checked: true }
          , { label: 'דואל', checked: true }
           ];
       }
       else if (rt == "3")//--רשימת בעלים לפי אזור
       {
           if (this.area != '') {
               return [
               { label: 'קוד בניין', checked: true }
              , { label: 'שם בניין', checked: true }
              , { label: 'אזור', checked: true }
              , { label: 'עיר', checked: true }
              , { label: 'רחוב', checked: true }
              , { label: 'מס. בית', checked: true }
              , { label: 'שטח כולל', checked: true }
              , { label: 'שם בעלים', checked: true }
              , { label: 'טלפון בעלים', checked: true }
              , { label: 'שטח כולל לבעלים', checked: true }
              , { label: 'יחס באחוזים', checked: true }
              , { label: 'איש קשר', checked: true }
              , { label: 'טלפון נייד', checked: true }
              , { label: 'דואר אלקטרוני', checked: true }
              , { label: 'טלפון', checked: true }];
           }
           else {
               return [
               { label: 'קוד בניין', checked: true }
              , { label: 'שם בניין', checked: true }
              , { label: 'אזור', checked: true }
              , { label: 'עיר', checked: true }
              , { label: 'רחוב', checked: true }
              , { label: 'מס. בית', checked: true }
              , { label: 'שטח כולל', checked: true }
              , { label: 'שם בעלים', checked: true }
              , { label: 'טלפון בעלים', checked: true }
              , { label: 'שטח כולל לבעלים', checked: true }
              , { label: 'יחס באחוזים', checked: true }
              , { label: 'איש קשר', checked: true }
              , { label: 'טלפון נייד', checked: true }
              , { label: 'דואר אלקטרוני', checked: true }
              , { label: 'טלפון', checked: true }];
           }
       }
       else if (rt == "4")//--ביקושים של לקוחות
       {
           if (this.area != '') {
               return [
               { label: 'שם הסוכן', checked: true }
              , { label: 'אזור', checked: true }
              , { label: 'שטח מבוקש', checked: true }
              , { label: 'תאריך ביקוש', checked: true}];
           }
           else {
               return [
               { label: 'שם הסוכן', checked: true }
              , { label: 'אזור', checked: true }
              , { label: 'שטח מבוקש', checked: true }
              , { label: 'תאריך ביקוש', checked: true}];
           }
       }
       else if (rt == "5")//--דוח שטחים פנויים
       {
           if (this.area != '') {
               return [
               { label: 'קוד בניין', checked: true }
              , { label: 'שם בניין', checked: true }
              , { label: 'אזור', checked: true }
              , { label: 'עיר', checked: true }
              , { label: 'רחוב', checked: true }
              , { label: 'מס. בית', checked: true }
              , { label: 'סגו נכס', checked: true }
              , { label: 'שטח', checked: true }
              , { label: 'שם בעלים', checked: true }
              , { label: 'טלפון בעלים', checked: true }
           , { label: 'שם הסוכן', checked: true }
           , { label: 'תאריך עדכון אחרון', checked: true}
           , { label: 'Memo', checked: false }];
           }
           else {
               return [
               { label: 'קוד בניין', checked: true }
              , { label: 'שם בניין', checked: true }
              , { label: 'אזור', checked: true }
              , { label: 'עיר', checked: true }
              , { label: 'רחוב', checked: true }
              , { label: 'מס. בית', checked: true }
              , { label: 'סגו נכס', checked: true }
              , { label: 'שטח', checked: true }
            , { label: 'שם בעלים', checked: true }
            , { label: 'טלפון בעלים', checked: true }
           , { label: 'שם הסוכן', checked: true }
           , { label: 'תאריך עדכון אחרון', checked: true }
           , { label: 'Memo', checked: false }];
           }
       }
       else {
           return [];
       }
   },
   grid: function (dataAdapter, ismobile) {
        var slf = this;
 
        //================================================

        //this.columnList = this.getGridColumns(this.reportType)

        $("#jqxgrid").jqxGrid(
        {
            width: '100%',
            autoheight: true,
            rtl: true,
            columnsresize: true,
            enablebrowserselection: true,
            enabletooltips: true,
            enableellipsis: true,
            source: dataAdapter,
            localization: getLocalization('he'),
            virtualmode: false,
            rendergridrows: function (obj) {
                //alert('virtualmode');
                console.log(obj)
                return obj.data;
            },
            pageable: true,
            pagermode: 'simple',
            altrows: true,
            sortable: true,
            showfilterrow: true,
            filterable: true,
            columns:slf.getGridColumns(slf.reportType)

        });
    },
    load: function (Model){//reportType,area) {
        
        this.reportType=Model.ReportType;
        this.area=Model.Area;
        //$("#hTitle").text(Model.ReportName);
        this.source.datafields=this.getGridFields(this.reportType,this.area);
        switch (Model.ReportType)
        {
            case 1:
                $("#hTitle").text("דוח: רשימת נכסים לפי אזור");
                this.source.data = { 'query_type': Model.ReportType, 'Area': Model.Area };
                break;
            case 2:
                $("#hTitle").text("דוח: רשימת נכסים לפי כתובת");

                //ReportName = "properties_by_address";
                //Arg1 = Request.Form["building_city"];
                //Arg2 = Request.Form["building_street"];
                this.source.id = 'קוד בניין';
                this.source.data = { 'query_type': Model.ReportType, 'CityCode': Model.Arg1, 'StreetId': Model.Arg2 };
                break;
            case 3:
                $("#hTitle").text("דוח: רשימת בעלים לפי אזור");

                //ReportName = "owners_by_area";
                //Area = Request.Form["Area"];
                this.source.id = '#';
                this.source.data = { 'query_type': Model.ReportType, 'Area': Model.Area };
                break;

            case 4:
                $("#hTitle").text("דוח: ביקושים של לקוחות");

                //ReportName = "customers_requests";
                //Area = Request.Form["Area"];
                //Arg1 = Request.Form["Purpose"];
                //Arg2 = Request.Form["RequestSize"];
                //this.source.id = 'קוד בניין';
                this.source.data = { 'query_type': Model.ReportType, 'Area': Model.Area, 'Purpose': Model.Arg1, 'RequestSize': Model.Arg2 };
                break;

            case 5:
                $("#hTitle").text("דוח: שטחים פנויים");

                //ReportName = "free_space_report";
                //Area = Request.Form["Area"];
                //Arg1 = Request.Form["Deal"];
                //Arg2 = Request.Form["RequestSize"];
                this.source.id = 'קוד בניין';
                this.source.data = { 'query_type': Model.ReportType, 'Area': Model.Area, 'Deal': Model.Arg1, 'RequestSize': Model.Arg2 };
                break;
        }
        //this.source.data = { 'id': id};
        
        var columnList = this.getGridColumnList(this.reportType)

        var ismobile = app.IsMobile();
        var dataAdapter = new $.jqx.dataAdapter(this.source, {
            async: false,
            loadComplete: function (data) {
                app_jqxgrid.gridColumnsInit(columnList, '#jqxgrid')
            },
            loadError: function (xhr, status, error) { alert(' status: ' + status + '\n error ' + error) }
        });
        app_jqxgrid.gridColumnsBar(columnList);

        this.grid(dataAdapter, ismobile);

    }
};
