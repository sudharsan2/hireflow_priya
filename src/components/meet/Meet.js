import { Input, Button, DatePicker, TimePicker, message } from 'antd';
import "./Meet.css"
import { useState } from 'react';
import axios from "axios";
import moment from 'moment';

export default function Meeting({ onSave, prevData }) {

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

    const onDateChange = (value) => {
        // const date = formatDate(dateobj);
        value = value ? value.format("YYYY-MM-DD") : null;
        setMeeting({ ...meeting, date: value });
    };

    const onStartTimeChange = (time) => {
        
        
        const formatTime=time?time.format(timeFormat):null;
        console.log("formatTime", formatTime);
        
        setMeeting({ ...meeting, startTime: formatTime });
    };

    const onEndTimeChange = (time) => {
        const formatTime=time?time.format(timeFormat):null;
        console.log("formatTime", formatTime);
        setMeeting({ ...meeting, endTime: formatTime });
    };
    const [meeting, setMeeting] = useState({
        "meetingURL": "",
        "candidate": prevData.resumeId,
        // "resumeId":prevData.resumeId,
        "interviewer": prevData.interviewer,
        "date": "",
        "startTime": null,
        "endTime": null,
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
    if (!meeting.interviewer) {
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

    const [meetLoading, setMeetLoading] = useState(false);
    const handleSubmit = async () => {
        console.log("meeting", meeting)
        setMeetLoading(true);
        // console.log("details", details)
        if (!validationForm()) {
            // Validation failed, stop form submission
            setMeeting({
                "meetingURL": "",
                "candidate": prevData.resumeId,
                "interviewer": prevData.interviewer,
                "date": "",
                "startTime": null,
                "endTime": null,
                "description": ""
            });
            setMeetLoading(false);
            onSave();
            return;
        }
        try {
            const response = await axios.post(
                "https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/createMeeting/", meeting,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("accessToken"),
                    },
                }
            );
            if (response.status = 201) {
                success();

                // setMeeting({
                //     "meetingURL": "",
                //     "candidate": "",
                //     "interviewer": "",
                //     "date": "",
                //     "startTime": "",
                //     "endTime": "",
                //     "description": ""
                // });

                onSave();
            }
        } catch (error) {
            console.error("Failed to fetch users:", error.message);
        }
        finally {
            setMeetLoading(false);
            setMeeting({
                "meetingURL": "",
                "candidate": prevData.resumeId,
                "interviewer": prevData.interviewer,
                "date": "",
                "startTime": null,
                "endTime": null,
                "description": ""
            });
        }

    };


    return (
        <div className='meeting'>
            <h1>Schedule a Meet</h1>
            {/* <label>Meeting URL:</label> */}
            <label style={{ fontSize: '20px', paddingBottom: "20px" }}>{prevData.name}</label>
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

            {/* <label>{prevData.resumeId}</label> */}
            {/* <Input
                name="interviewer"
                value={prevData.interviewer}
                placeholder="Interviewer"
            // onChange={handleChange}
            /> */}
            {/* <label>Date:</label> */}
            <DatePicker
                onChange={onDateChange}
                format={dateFormat}
                // value={meeting.date}
                value={meeting.date ? moment(meeting.date, "YYYY-MM-DD") : null}

            />
            <div className='timePicker'>
                {/* <label>Time</label> */}
                <TimePicker
                    value={meeting.startTime ? moment(meeting.startTime, timeFormat) : null}
                    format={timeFormat}
                    placeholder="From"
                    className='fromTime'
                    onChange={onStartTimeChange}
                />

                <TimePicker
                    value={meeting.endTime ? moment(meeting.endTime, timeFormat) : null}
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
                loading={meetLoading}
                onClick={handleSubmit}
            >Schedule Meet
            </Button>
        </div>
    )
}