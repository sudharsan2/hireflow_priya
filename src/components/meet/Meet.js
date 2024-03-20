import { Input, Button, DatePicker, TimePicker, message } from 'antd';
import "./Meet.css"
import { useState } from 'react';
import axios from "axios";
import moment from 'moment';


function formatTime(time) {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // Add leading zeros if necessary
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return formattedHours + ':' + formattedMinutes;
}

function formatDate(date) {
    const dateObject = new Date(date);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month index
    const year = dateObject.getFullYear();

    // Pad single digit day and month with leading zeros if needed
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return year + '-' + formattedMonth + '-' + formattedDay;
}

export default function Meeting({ onSave, prevData}) {

    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        console.log("clicked")
        messageApi.open({
            type: 'success',
            content: 'Meeting created successfully',
        });
    };
    const failure = (errorMessage) => {
        messageApi.open({
            type: 'error',
            content: errorMessage,
        });
    }
    const { TextArea } = Input;
    const timeFormat = 'h:mm A';
    const dateFormat = "DD/MM/YYYY";

    const onDateChange = (dateobj) => {
        const date = formatDate(dateobj);
        setMeeting({ ...meeting, date });
    };

    const onStartTimeChange = (time) => {
        setMeeting({ ...meeting, startTime: formatTime(time) });
    };

    const onEndTimeChange = (time) => {
        setMeeting({ ...meeting, endTime: formatTime(time) });
    };
    const [meeting, setMeeting] = useState({
        "meetingURL": "",
        "candidate": prevData.candidate,
        "interviewer": "",
        "date": "",
        "startTime": "",
        "endTime": "",
        "description": ""
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeeting({ ...meeting, [name]: value });
    }

    const validationForm = () => {
        if (!meeting.meetingURL.trim()) {
            failure('Meeting URL is required');
            return false;
        }
        if (!meeting.interviewer.trim()) {
            failure('Interviewer is required');
            return false;
        }
        if (!meeting.date.trim()) {
            failure('date is required');
            return false;
        }
        if (!meeting.startTime.trim()) {
            failure('Start Time is required');
            return false;
        }
        if (!meeting.endTime.trim()) {
            failure('End Time is required');
            return false;
        }
        if (!meeting.description.trim()) {
            failure('description is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        console.log("meeting", meeting)
        // console.log("details", details)
        if (!validationForm()) {
            // Validation failed, stop form submission
            return;
        }
        try {
            const response = await axios.post(
                "http://172.235.10.116:7000/hiring/entryLevel/createMeeting/", meeting,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("accessToken"),
                    },
                }
            );
            if (response.status = 201) {
                success();

                setMeeting({
                    "meetingURL": "",
                    "candidate": "",
                    "interviewer": "",
                    "date": "",
                    "startTime": "",
                    "endTime": "",
                    "description": ""
                });
                setMeeting({
                    ...meeting,
                    date: "",
                    startTime: "",
                    endTime: ""
                });
                onSave();
            }
        } catch (error) {
            console.error("Failed to fetch users:", error.message);
        }

    };


    return (
        <div className='meeting'>
            <h1>Schedule a Meet</h1>
            {/* <label>Meeting URL:</label> */}
            <Input
                name="meetingURL"
                placeholder="MeetingURL"
                value={meeting.meetingURL}
                onChange={handleChange}
            />
            {/* <label>Candidate:</label> */}
            {/* <Input
                name="candidate"
                placeholder="Candidate"
                value={prevData.name}
                onChange={handleChange}
            /> */}
            <label>{prevData.name}</label>
            <Input
                name="interviewer"
                value={prevData.interviewer}
                placeholder="Interviewer"
                onChange={handleChange}
            />
            {/* <label>Date:</label> */}
            <DatePicker
                onChange={onDateChange}
                format={dateFormat}
                // value={meeting.date}
            />
            <div className='timePicker'>
                {/* <label>Time</label> */}
                <TimePicker
                    // value={meeting.startTime}
                    format={timeFormat}
                    placeholder="From"
                    className='fromTime'
                    onChange={onStartTimeChange}
                />

                <TimePicker
                    // value={meeting.endTime}
                    format={timeFormat}
                    placeholder="To"
                    onChange={onEndTimeChange}
                />
            </div>


            {/* <label>Description</label> */}
            <TextArea
                name="description"
                value={meeting.description}
                onChange={handleChange}
                placeholder="Description"
                autoSize={{ minRows: 3, maxRows: 5 }}
            />


            <div style={{ margin: '24px 0', backgroundColor: "black" }} />
            {contextHolder}
            <Button
                onClick={handleSubmit}
            >Schedule Meet
            </Button>
        </div>
    )
}