import React, { useState, useEffect } from 'react';
import Icon from "../elements/Icon";
import styled from "styled-components";
import colors from '../../util/Colors';
import { ArrayOfDates, DateTimeFormat, weekTimeFormat } from '../../util/TimeFormat';
import ProfileIMage from '../../assets/svg/Profile.jpg';
import { IconEnum as Icons } from "../elements/Icons";
import { calendarData } from './WeekMeeting';
import moment from 'moment';

interface IWeekCalendarProps { }

const CalendarWrapper = styled.div`
`;
const CalendarArrow = styled.div`
    display: flex;
    align-items: center;
    grid-gap:15px;
    span{
        width: 35px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${colors.grey2};
        border-radius:8px;
    }
    h6{
        font-size: 16px;
        font-family: 'euclid_circular_bbold';
        color: ${colors.black};
    }
    svg{
        font-size: 14px !important;
        color: ${colors.black} !important;
    }
`;
const CalendarHeader = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex: 1;
    padding-left: 100px;
`;
const CalHeadCol = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px 12px;
    border-bottom: 1px solid ${colors.exlightblue};
    h3{
        font-size: 22px;
        color: ${colors.grey};
        font-family: 'euclid_circular_bbold';
        margin: 0;
    } 
    span{
        font-size: 12px;
        color: ${colors.grey};
        font-family: 'euclid_circular_bbold';
        margin: 0;
        text-transform: uppercase;
    }
    &.active{
        h3,span{{
            color: ${colors.black}; 
        }        
    }
`;
const CalendarBody = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex: 1;
    padding-left: 100px;
    position:relative;
    &:before{
        position: absolute;
        content: '';
        border-right: 1px solid ${colors.exlightblue};  
        height: 100%;
    }
    &:after{
        position: absolute;
        content: '';
        background-color: ${colors.exlightblue}; 
        width: 34px;
        margin-left: -34px;
        z-index: 99;
        height: 1px;
        top: -1px;
    }
    .timeSlot {
        position: absolute;
        left: 0;
        top: -10px;
        font-size: 12px;
        font-family: 'euclid_circular_bregular';
        color: ${colors.blue2};  
    }
       
`;
const CalBodyCol = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px 12px;
    border-bottom: 1px solid ${colors.exlightblue};  
    min-height: 120px;  
    border-right: 1px solid ${colors.exlightblue};  
    position:relative;     
`;
const EventCol = styled.div`
    &.eventCol{
        padding: 10px;
        border-radius: 8px;
        position: absolute;
       top:0%;
        cursor: pointer;
        width: 100%;
        z-index: 9;
        h5{
            color: ${colors.white}; 
            margin: 0 0 8px; 
            font-size:14px;
            font-family: 'euclid_circular_bbold';
        }
        h6{
            color: ${colors.white};
            margin: 0; 
            font-size:12px;
            font-family: 'euclid_circular_bbold'; 
        }
        p{
            color: ${colors.white};  
            margin: 0;
            font-size:12px;
            font-family: 'euclid_circular_bbold';
        }
        &.col-1{
            h6{
                margin-top:10%;
            }
        }
        &.col-2{
            top:0;
            h6{
                margin-top:79%;
            }
        }
        &.col-3{
            top:-30px;
            h6{
                margin-top:10%;
            }
        }
        &.col-4{
            top:20%;
            h6{
                margin-top:10%;
            }
        }
        &.col-5{
            top:0;
            h6{
                margin-top:45%;
            }
        }
        &.col-6{
            top:60%;
            h6{
                margin-top:22%;
            }
        }
        &.col-7{
            top:30%;
            h6{
                margin-top:15%;
            }
        }
        &.col-8{
            h6{
                margin-top:10%;
            }
        }
        &.col-9{
            top:60%;
            h6{
                margin-top:35%;
            }
        }
       &.LightBlue{
           background-color: ${colors.blue3};  
       } 
       &.darkBlue{
        background-color: ${colors.blue4};  
       }
    }
`;
const UserImageWrapper = styled.div`
    display: flex;
    align-items: center;
    .userImage {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${colors.basecolor};
        border-radius: 50%;
        margin-left: -10px;
        position: relative;
        z-index: 99;
        color: ${colors.black};
        font-size: 14px;
        font-family: 'euclid_circular_bmedium';
    }
`;
const UserImages = styled.div`
    width: 20px;
    height: 20px;
    overflow: hidden;
    border-radius: 50%;
    object-fit: cover;
    &.overalpImage{
        margin-left: -10px;
        position: relative;
        z-index: 9;
        border: 1px solid ${colors.white};
    }
    img{
        width: 20px;
        height: 20px;
        object-fit: cover;
    }
`;
const time = ['9:00:00 AM', '9:30:00 AM', '10:00:00 AM', '10:30:00 AM', '11:00:00 AM', '11:30:00 AM', '12:00:00 PM', '12:30:00 PM',
  '1:00:00 PM', '1:30:00 PM', '2:00:00 PM', '2:30:00 PM', '3:00:00 PM', '3:30:00 PM', '4:00:00 PM', '4:30:00 PM', '5:00:00 PM', '5:30:00 PM', '6:00:00 PM', '6:30:00 PM', '7:00:00 PM',
  '7:30:00 PM', '8:00:00 PM'];

const WeekCalendar: React.FunctionComponent<IWeekCalendarProps> = (props) => {
  const [weekStartDate, setWeekStartDate] = useState('');
  const [weekEndDate, setWeekEndDate] = useState('');
  const [weekDates, setWeekDates] = useState<String[]>([]);

  useEffect(() => {
    function getweek() {
      let dates = weekTimeFormat();
      setWeekData(dates);
    }
    if (!weekStartDate) {
      getweek()
    }
  });
  function setWeekData(dates: any) {
    setWeekStartDate(dates.startDate);
    setWeekEndDate(dates.endDate);
    let day = ArrayOfDates(dates.startDate, 6);

    setWeekDates(day)
  }
  function nextWeek() {
    let dates = weekTimeFormat(weekStartDate, weekEndDate, 'increase');
    setWeekData(dates)
  }

  function previousWeek() {
    let dates = weekTimeFormat(weekStartDate, weekEndDate);
    setWeekData(dates)
  }
  return (<CalendarWrapper>
    <CalendarArrow>
      <span onClick={() => previousWeek()}><Icon icon={Icons.LeftArrow} /></span> <span onClick={() => nextWeek()}><Icon icon={Icons.RightArrow} /></span>
      {weekStartDate && <h6> {DateTimeFormat(weekStartDate, 'DD MMMM, YYYY')} – {DateTimeFormat(weekEndDate, 'DD MMMM, YYYY')}</h6>}
    </CalendarArrow>
    <CalendarHeader>
      {weekDates.map((item) => {
        return (
          <CalHeadCol>
            <h3>{DateTimeFormat(item, 'DD')}</h3>
            <span>{DateTimeFormat(item, 'ddd')}</span>
          </CalHeadCol>
        );
      })}
    </CalendarHeader>


    {time.map((time) => {

      let formatTime = moment(time, 'h:mm:ss A').format('h:mm A')
      return (
        <CalendarBody><span className="timeSlot">{formatTime}</span>
          {weekDates.map((weekDate) => {
            let data = DateTimeFormat(weekDate, 'DD-MM-YYYY');
            let calendar = calendarData.filter((i) => {
              let Time = moment(i.startTiming, 'h:mm:ss A').format('h:mm A');
              return (data === i.Date && (formatTime === Time))
            });
            return (calendar.length > 0 ?
              calendar.map((item) => {
                let endtime = moment(item.EndTiming, 'h:mm:ss A');
                let startTime = moment(item.startTiming, 'h:mm:ss A')
                let diffCal = endtime.diff(startTime, 'minutes');
                let height = diffCal * 3.40;
                return (<CalBodyCol>
                  <EventCol className="eventCol LightBlue col-1" style={{ "height": `${height}%` }}>
                    <h5>{item.title}</h5>
                    <p>{moment(item.startTiming, 'h:mm:ss A').format('hh:mm') + ' - '
                      + moment(item.EndTiming, 'h:mm:ss A').format('hh:mm')}</p>
                    <h6>5 Participants</h6>
                    <UserImageWrapper>
                      <UserImages> <img src={ProfileIMage}alt=""></img></UserImages>
                      <UserImages className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImages>
                      <UserImages className="overalpImage"><img src={ProfileIMage}alt=""></img></UserImages>
                      <span className="userImage">+5</span>
                    </UserImageWrapper>
                  </EventCol>
                </CalBodyCol>)
              }) :
              <CalBodyCol></CalBodyCol>)
          })}
        </CalendarBody>
      )
    })}
  </CalendarWrapper>);
};

export default WeekCalendar;
