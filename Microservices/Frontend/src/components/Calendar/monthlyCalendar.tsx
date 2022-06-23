import React, { useState, useEffect } from 'react';
import Icon from "../elements/Icon";
import styled from "styled-components";
import colors from '../../util/Colors';
import { ArrayOfDates, DateTimeFormat, weekTimeFormat } from '../../util/TimeFormat';
import { IconEnum as Icons } from "../elements/Icons";
interface IMonthlyCalendarCalendarProps { }

const CalendarWrapper = styled.div`
    display: none;
    @media (min-width:992px){ 
        display: block;
    }
`;
const CalendarHeader = styled.div`
    display: flex ;
    width: 100% ;
    justify-content: space-between ;
    flex: 1 ;
`;
const CalendarArrow = styled.div`
    display: flex;
    align-items: center;
    grid-gap:15px;
    justify-content: space-between;
    span{
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius:8px;
    }
    h6{
        font-size: 16px;
        font-family: 'euclid_circular_abold';
        color: ${colors.black};
        display: flex;
        grid-gap:10px;
        white-space: nowrap;
    }
    svg{
        font-size: 20px !important;
        color: ${colors.black1} !important;
    }
`;
const CalHeadCol = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10px 12px;
    border-bottom: 1px solid ${colors.exlightblue};
    @media (max-width:1199px){ 
        padding: 8px;
    }
    h3{
        font-size: 14px;
        color: ${colors.grey};
        font-family: 'euclid_circular_aregular';
        margin: 0;
        cursor: pointer;
    } 
    &.active,&:hover{
        h3{
            color: ${colors.white}; 
            width: 30px;
            height: 30px;
            border-radius: 50%;
            justify-content: center;
            align-items: center;
            display: flex;
            background-color: ${colors.darkblue}; 
        }        
    }
`;
const SortListWrapper = styled.div`
    display: flex;
    align-items: center;
    grid-gap: 30px;
    .divider {
        font-size:16px;
        color: ${colors.black} !important;
        font-family: 'euclid_circular_abold';
        margin: 0 !important;
    }
    .dropdown{
        border-radius: 8px !important;
        
        &.icon {
            font-size: 18px !important;
            padding: 10px !important;
        } 
        &.multiSelect{
            padding: 4px 15px !important;
            min-height: 45px;
            display: flex;
            align-items: center;
            flex-flow: wrap; 
            font-family: 'euclid_circular_bbold' !important;
            min-width: 140px; 
            border: none;  
        }
        &.active {
            box-shadow: none;
        }
    } 
`;

const MonthlyCalendar: React.FunctionComponent<IMonthlyCalendarCalendarProps> = (props) => {
  const [weekStartDate, setWeekStartDate] = useState('');
  const [weekEndDate, setWeekEndDate] = useState('');
  const [weekDates, setWeekDates] = useState<String[]>([]);

  useEffect(() => {
    function getweek() {
      let dates = weekTimeFormat('','','','month');
      setWeekData(dates);
    }
    if (!weekStartDate) {
      getweek()
    }
  });
  function setWeekData(dates: any) {
    setWeekStartDate(dates.startDate);
    setWeekEndDate(dates.endDate);
    let day = ArrayOfDates(dates.startDate, parseInt(DateTimeFormat(dates.endDate, 'DD')) - 1);

    setWeekDates(day)
  }
  function nextWeek() {
    let dates = weekTimeFormat(weekStartDate, weekEndDate, 'increase', 'month');
    setWeekData(dates)
  }

  function previousWeek() {
    let dates = weekTimeFormat(weekStartDate, weekEndDate, '', 'month');
    setWeekData(dates)
  }
  return (
    <CalendarWrapper>
      <CalendarArrow>
        <h6><span onClick={() => previousWeek()}><Icon icon={Icons.LeArrow} /></span> {DateTimeFormat(weekStartDate, 'MMMM, YYYY')}<span onClick={() => nextWeek()}><Icon icon={Icons.RiArrow} /></span> </h6>
        <SortListWrapper>
          {/* <Dropdown className="multiSelect" placeholder='Select Title' fluid selection options={genderTitle} /> */}
          {/* <h6><span><Icon icon={Icons.LeArrow} /></span> Today <span><Icon icon={Icons.RiArrow} /></span> </h6> */}
        </SortListWrapper>
      </CalendarArrow>


      <CalendarHeader>
      {weekDates.map((item) => {
        return (
          <CalHeadCol>
            <h3>{DateTimeFormat(item, 'DD')}</h3>
          </CalHeadCol>
        );
      })}
    </CalendarHeader>
    </CalendarWrapper>
  );
};

export default MonthlyCalendar;
