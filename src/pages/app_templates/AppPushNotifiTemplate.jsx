import React, { useEffect, useState,useCallback } from 'react'
import Iconify from 'src/components/Iconify';
import {Paper} from '@mui/material';
import { Grid, Container, Typography, IconButton } from '@mui/material';
import imageImport from 'src/utils/imageImport';

function AppPushNotifiTemplate({notificationTitle,notificationMessage,notificationImage}) {
    //====== current app time =======
  //====== current app time =======
  return (
    <div>
          <div className='status_of_app_and_dashboard'>
        <div class="smartphone">
            <div class="content app-background-img"  >
                {/*=========== APP HOME SCREEN ============ */}
               
                 <div className='app-home-screen-bottom-payment' >
                {/* <div className='top_phone_things_baterry_network'>
                    <div className='left_items'>
                        <span>01:20PM</span>
                        <Iconify className='top_basic_item_icon' icon="carbon:logo-instagram" />
                        <Iconify className='top_basic_item_icon' icon="ic:baseline-whatsapp" />
                        <Iconify className='top_basic_item_icon' icon="mingcute:notification-fill" />
                    </div>
                    <div className='right_items'>
                    <Iconify className='top_basic_item_icon' icon="material-symbols:alarm-outline" />
                    <Iconify className='top_basic_item_icon' icon="mdi:network-favorite" />
                    <Iconify className='top_basic_item_icon' icon="game-icons:network-bars" />
                    <Iconify className='top_basic_item_icon' icon="ion:battery-half-outline" />

                    </div>
                </div> */}

                    <div style={{margin:6}} >
                    <Grid container >
          <Grid item xs={12}   >
           <Paper elevation={4} sx={{p:1.2,}} >
          
          
            <Typography variant="body2" className='flex' sx={{fontSize:12,gap:0.5 }}  > <Iconify icon="icon-park-solid:more-app" /> App Name</Typography>
           {notificationTitle ?
                    <Typography variant="subtitle1" sx={{fontSize:13,mt:0.4}} >{notificationTitle?.slice(0,43)}{notificationTitle?.length > 44 && '...'}</Typography>
                    :
                    <Typography variant="subtitle1" sx={{fontSize:13,mt:0.4}} >Sale!! Get 50% Off on Every Purchase. 🥳</Typography>
                    }
            {notificationMessage ?
            <p  style={{ fontSize:11,color:'gray', }} >{notificationMessage}</p>
            :
            <p  style={{ fontSize:11,color:'gray', }} >Get exclusive discount on mens fashion & baby care at every first purchase.</p>    
        }
           <div className='notification_image'  >
            {(notificationTitle?.length > 1 && notificationMessage?.length > 1  ) ?
        
        <img  src={notificationImage} alt="" />
        :
        <img  src={notificationImage ? notificationImage : imageImport?.push_notification_SampleImage} alt="" />

        }
           </div>
       
          </Paper>
          </Grid>
          </Grid>
                    </div>



                {/* <div className='bottom_navbar'>
                    <div className='navbar_icons'>
                    <div onClick={()=>setAppScreen('HOME')}  style={appScreen == 'HOME' ? {color:appDetails?.app_color}:{}} className='navbar_basic_icon'>
                        <Iconify className="navicon" icon="ion:home" />
                    </div>
                    <div onClick={()=>setAppScreen('CATEGORY')}   className='navbar_basic_icon'>
                    <Iconify className="navicon" icon="material-symbols:category" />
                    </div>
                    <div onClick={()=>setAppScreen('ORDER')} style={{backgroundColor:appDetails?.app_color ? appDetails?.app_color : 'gray' }} className='main_navicon'>
                        <Iconify className="navicon" id='main_icon' icon="heroicons:shopping-bag-20-solid" />
                    </div>
                    <div onClick={()=>setAppScreen('CART')} className='navbar_basic_icon'>
                    <span className='cart-icon-product-count' >2</span>
                    <Iconify className="navicon" icon="entypo:shopping-cart" />
                    </div>
                    <div onClick={()=>setAppScreen('ACCOUNT')} className='navbar_basic_icon'>
                    <Iconify className="navicon" icon="ic:sharp-account-circle" width={28} height={28} />
                    </div>
                    </div>
                </div> */}
            </div>

               {/*======= APP HOME SCREEN ==========*/}

              
              

            </div>
        </div>
    </div>

    </div>
  )
}

export default AppPushNotifiTemplate