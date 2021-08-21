import React from "react";

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeInfo = this.handleChangeInfo.bind(this)
    }

    handleChangeInfo(e) {
        this.props.onInfoChange(e)
    }

    render() {
        const date = this.props.date
        const distance = this.props.distance
        const time = this.props.time
        const IP = this.props.IP
        const isSubmit = this.props.isSubmit
        const isCashed = this.props.isCashed
        return (
            <div className="infoContainer">
                <div className="infoDist">
                    <label>Distance:</label>
                    <span className="distance">{distance}</span>
                </div>
                <div className="infoTime">
                    <label>Time:</label>
                    <span className="time">{time}</span>
                </div>
                <div className="infoDate">
                    <label>Date:</label>
                    <span className="date">{date}</span>
                </div>
                <div className="infoIp">
                    <label>IP:</label>
                    <span className="ip">{IP}</span>
                </div>
                {isSubmit==true?(
                isCashed?(
                    <div className="cash">path was taken from cash</div>
                ):(<div className="cash">new path</div>)
            ):(<div></div>)}

            </div>

        );
    }

}

export default Info;






