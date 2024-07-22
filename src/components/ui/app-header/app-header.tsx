import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, NavLink, NavLinkProps, useNavigate } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <>
          <BurgerIcon type={'primary'} />
          <NavLink
            className={({ isActive }) =>
              isActive ? styles.link_active : styles.link
            }
            to={'/'}
          >
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
        </>
        <>
          <ListIcon type={'primary'} />
          <NavLink
            className={({ isActive }) =>
              isActive ? styles.link_active : styles.link
            }
            to={'/feed'}
          >
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <div className={styles.link_position_last}>
        <>
          <ProfileIcon type={'primary'} />
          <NavLink
            className={({ isActive }) =>
              isActive ? styles.link_active : styles.link
            }
            to={'/profile'}
          >
            {' '}
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </>
      </div>
    </nav>
  </header>
);
