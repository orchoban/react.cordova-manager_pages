import React from 'react';
import $ from './jquery-3.3.1.min';
import './styles.css';
import './animate.css';

export default class Navigator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      historyPages: [this.props.homePageKey]
      ,nowPage:this.props.homePageKey
    }
    this.myComponentApp = this.props.myComponentApp;


    this.historyPages = this.state.historyPages;

    this.listLevelPages = [];

    let listLevelPages = this.listLevelPages;
    this.props.children.map((child) => {
      listLevelPages[child.key] =
        child.props.levelPage === undefined
          ? child.key === this.props.homePageKey
            ? 0 : 99
          : child.props.levelPage
    });


    // const childrenWithProps = React.Children.map(this.props.children, child =>
    //   React.cloneElement(child, { doSomething: this.doSomething })
    // );
    // this.props.nowPage(this.historyPages[this.historyPages.length - 1]);

    this.bezy = false;


    this.props.myComponentApp.managerPages = this;

    this.changePage = this.changePage.bind(this);
  }


  //----navigator and animation----///
  funAnimationIn1(goToPage, fromPage) {
    const fthis = this;
    //--נכנסים דף פנימה Up--//
    let callbackFun = () => {
      fthis.funAnimationIn2(goToPage, fromPage);
      document.getElementById(goToPage).removeEventListener("webkitAnimationEnd", callbackFun);
    };

    document.getElementById(goToPage).addEventListener("webkitAnimationEnd", callbackFun, false);

    this.bezy = true;
    $('#' + goToPage).removeClass('hiddenPage');
    $('#' + goToPage).addClass('scrollPage showPage');
    $('#' + fromPage).css('z-index', 0);
    $('#' + goToPage).css('z-index', 89);
  }


  funAnimationIn2(goToPage, fromPage) {
    $('#' + fromPage).css('z-index', "");
    $('#' + goToPage).css('z-index', "");
    $('#' + goToPage).css('animation', '');
    $('#' + fromPage).removeClass('showPage');
    $('#' + fromPage).removeClass('scrollPage');
    $('#' + fromPage).addClass('hiddenPage');
    this.bezy = false;
    
    if (this.props.onChangePage !== undefined)
    this.props.onChangePage(this.state.historyPages[this.state.historyPages.length - 1]);
  }

  funAnimationOut1(goToPage, fromPage) {
    //--חזרה בדפים Down--//  
    let callbackFun = () => {
      this.funAnimationOut2(goToPage, fromPage);
      document.getElementById(fromPage).removeEventListener("webkitAnimationEnd", callbackFun);
    };
    document.getElementById(fromPage).addEventListener("webkitAnimationEnd", callbackFun);
    this.bezy = true;
    $('#' + goToPage).css('z-index', 0);
    $('#' + fromPage).css('z-index', 89);
    $('#' + goToPage).removeClass('hiddenPage');
    $('#' + goToPage).addClass('scrollPage showPage');
  }
  funAnimationOut2(goToPage, fromPage) {
    $('#' + fromPage).css('animation', '');
    $('#' + goToPage).css('z-index', "");
    $('#' + fromPage).css('z-index', "");
    $('#' + fromPage).removeClass('showPage');
    $('#' + fromPage).removeClass('scrollPage');
    $('#' + fromPage).addClass('hiddenPage');
    this.bezy = false;

    if (this.props.onChangePage !== undefined)
    this.props.onChangePage(this.state.historyPages[this.state.historyPages.length - 1]);
  }


  changePage(goToPage, animationIn,animationOut, timeAnimationInMS, callbackFun) {
    //debugger
    if (!this.bezy) {
      const fthis = this;

      const fromPage = "" + this.historyPages[this.historyPages.length - 1] + "";


      //--animation time defult
      const timeAnimation = timeAnimationInMS !== undefined && timeAnimationInMS !== null ? timeAnimationInMS
        : 250;//ms

      if (goToPage !== fromPage) {
        //---ניהול חזרות----//
        this.bezy = true;
        //סיום האפליקציה, סגור
        if (this.state.historyPages.length === 1
          && goToPage === undefined) {
          console.log('"window.navigator.app.exitApp()"');
          fthis.showSwalLater
            ? fthis.myChildrens.swal.runSwal(true)
            : window.navigator.app.exitApp();
        } else {
          ///שמור היסטוריה
          let new_historyPages = this.state.historyPages.slice();

          if (this.listLevelPages[goToPage] <= this.listLevelPages[fromPage]) {
            //חוזרים אחורה, מחק את כל הדפים שהרמה שלהם גבוהה משלי.
            //new_historyPages.splice(new_historyPages.length - 1, 1);
            new_historyPages = new_historyPages.filter((x) => this.listLevelPages[x] < this.listLevelPages[goToPage]);
          }
          new_historyPages.push(goToPage);
          //שמירת שינויים בהיסטוריה
          this.setState({ historyPages: new_historyPages });
        }

        //----navigator and animation----///

        if (this.listLevelPages[goToPage] > this.listLevelPages[fromPage]) {
          //--נכנסים דף פנימה Up--//
          this.funAnimationIn1(goToPage, fromPage);

          if (this.listLevelPages[goToPage] === 1) {
            //Up from level 0 to level 1
            $('#' + goToPage).css('animation', (animationIn !== null && animationIn !== undefined ? animationIn : 'slideInRight') + " " + timeAnimation + 'ms');

          } else { //else if (this.listLevelPages[goToPage] === 2) {
            //Up from level 1 to level 2
            $('#' + goToPage).css('animation', (animationIn !== null && animationIn !== undefined ? animationIn : 'zoomIn') + " " + timeAnimation + 'ms');
          }
        } else {
          //--חזרה בדפים Down--//   
          this.funAnimationOut1(goToPage, fromPage);
          if (this.listLevelPages[fromPage] === 1) {
            //Down from level 1 to level 0
            $('#' + fromPage).css('animation', (animationOut !== null && animationOut !== undefined ? animationOut : 'slideOutRight') + " " + timeAnimation + 'ms');
          }
          else { //else if (this.listLevelPages[goToPage] === 1) {
            //Down from level 2 to level 1
            $('#' + fromPage).css('animation', (animationOut !== null && animationOut !== undefined ? animationOut : 'zoomOut') + " " + timeAnimation + 'ms');

          }
        }
        // //עיצוב כפתור חזרה
        // if (goToPage === "home") {
        //     $('#navigatorBack').css('display', "none");
        // } else {
        //     $('#navigatorBack').css('display', "flex");
        // }

     

        if (callbackFun !== undefined)
          callbackFun();
      }
    }

  }

  componentWillMount() {
    if (window.cordova) {

      // //---lock portrait
      // window.screen.orientation.lock('portrait');

      //--back button in android
      document.addEventListener("backbutton"
        , (e) => {
          window.closeOrBack();
        }
        , false);
    }
  }

  render() {
    const fthis = this;

    const nowPage = this.state.historyPages[this.state.historyPages.length - 1];
   

    this.historyPages = this.state.historyPages.slice();
    return this.props.children.map(child => {
      return <div style={{ backgroundColor: "#fff" ,height:fthis.props.height}} id={child.key} className={fthis.props.homePageKey === child.key ? "showPage scrollPage" : "hiddenPage"}>
        {nowPage === child.key || fthis.state.historyPages.includes(child.key)
          ? child
          : <div />}
      </div>
    });
  }

}
