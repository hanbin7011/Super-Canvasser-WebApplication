
import React, { Component } from 'react';
import Image from 'react-image-resizer';
import '../css/App.css';
import appLogo from '../img/app_logo.png';
import Grid from '@material-ui/core/Grid';
import LoginAndRegister from './LoginAndRegister';
import {BrowserRouter, Route } from 'react-router-dom';

class Main extends Component {
   
   render() {
      return (
         <Grid className="container" container spacing={0} direction='column' justify='center'>
            <Grid item xs={12} className="appLogo" container justify='center'>
               <Image src={appLogo} height={150} width={150}/>
            </Grid>
            <Grid item xs={12} className="header" container justify='center'>
               <h1 className='title'>Super Canvasser</h1>
            </Grid>

            <BrowserRouter>
               <Route path='/' exact strict component={LoginAndRegister}/>
            </BrowserRouter>

         </Grid>
      );
   }
}

export default Main;