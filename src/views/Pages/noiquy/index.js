import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
class NoiQuyCty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    componentWillMount() {

    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <AppBar position="static" color="default">
                    <Toolbar style={{textAlign: 'center'}}>
                        <Typography variant="h6" color="inherit">
                            QUY ĐỊNH CÔNG TY
                    </Typography>
                    </Toolbar>
                </AppBar>
                <ExpansionPanel>
                    <ExpansionPanelSummary>
                        <Typography className={classes.heading}>Quy định giờ đi làm</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            <p>- Ngày bình thường đi làm làm từ 7h30 đến 17h30</p>
                            <p>- Sáng thứ 7: từ 8:00 đến 12:00 các team đào tạo, họp và sắp xếp công việc trong tuần, kế hoạch tuấn tiếp theo</p>
                            <p>- Bắt đầu từ 1/2/2019 Công ty sẽ sử dụng máy chấm trên điện thoại với nhân viên làm việc tại văn phòng</p>
                            <p>- Thời gian làm việc sẽ được apply trên máy chấm công và sử dụng để tính lương tháng, vì vậy anh chị em chú ý về giờ in – out</p>
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary>
                        <Typography className={classes.heading}>Quy định chấm công</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            <p>Nhân viên làm việc tại văn phòng thực hiện chấm công bằng vân tay, ứng dụng  điện thoại</p>
                            <p>Những nhân viên cần giải quyết công việc công ty trước khi đến văn phòng phải thông báo cho Trưởng bộ phận/HR để tính chấm công.</p>
                            <p>Trong giờ làm việc, nhân viên cần giải quyết công việc công ty ngoài văn phòng phải có thông báo cho Trưởng bộ phận/HR. Nếu không thông báo sẽ trừ ngày phép hoặc tính nghỉ không lương nếu hết ngày phép</p>
                            <p>Nhân viên chỉ được phép xin đi muộn 1 lần trong 1 tuần. Nếu đã xin đi muộn rồi, những lần sau có xin phép cũng tính là lỗi đi muộn:</p>
                            <p>- Đi muộn từ 2 tiếng trở lên sẽ tính là nghỉ ½ ngày (trừ ngày phép hoặc tính nghỉ không lương nếu hết ngày phép);</p>
                            <p>- Đi muộn 1 tuần quá 3 lần hoặc 1 tháng quá 5 lần sẽ bị cảnh cáo;</p>
                            <p>- Phạt cảnh cáo quá 3 lần/1 năm hoặc đi muộn quá 25 lần/năm sẽ không tăng lương</p>
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary>
                        <Typography className={classes.heading}>Quy Định Nghỉ phép</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            <p>CBNV sẽ được nghỉ hàng năm 12 ngày phép hưởng nguyên lương (chỉ áp dụng với nhân viên chính thức). Trong một năm làm việc, CBNV có tổng thời gian nghỉ (cộng dồn) do tai nạn lao động, bệnh nghề nghiệp quá 6 tháng (144 ngày làm việc); hoặc do ốm đau quá 3 tháng (72 ngày việc) thì thời gian đó không được tính để hưởng chế độ nghỉ hàng năm của năm ấy</p>
                            <p>Nhân viên được nghỉ dồn phép 3 ngày 1 tháng (một năm không quá 2 lần). Trường hợp nghỉ dồn phép nhiều hơn số ngày quy định phải có sự chấp thuận của Giám đốc Công ty.</p>
                            <p>Số ngày nghỉ phép được tăng lên theo thâm niên làm việc. Cứ 5 năm làm việc được nghỉ thêm một ngày phép.</p>
                            <p>Khi có nhu cầu nghỉ phép nhân viên phải viết “Giấy xin nghỉ phép” (Theo mẫu) gửi tới Giám Đốc/Trưởng bộ phận sau khi được phê duyệt thì chuyển tới Phòng Hành chính – Nhân sự:</p>
                            <p>• Đối với trường hợp nghỉ phép 01 ngày: xin phép trước 01 ngày.</p>
                            <p>• Đối với trường hợp nghỉ phép từ trên 01 ngày đến 03 ngày: xin phép trước 1 tuần</p>
                            <p>• Đối với trường hợp xin nghỉ phép trên 3 ngày: xin phép trước 2 tuần. Trường hợp nghỉ đột xuất phải viết mail hoặc gọi điện báo với Trưởng phòng hoặc Trưởng phòng Hành chính – Nhân sự. Mỗi CBNV không được nghỉ đột xuất quá 01 lần/tháng và 03 lần/năm.</p>
                            <p>Khi nghỉ phép phải bàn giao công việc, chìa khoá tủ (nếu có), tài sản cho Trưởng phòng hoặc phòng Hành chính – Nhân sự tạm quản lý trong thời gian vắng mặt.</p>
                            <p>Trường hợp nghỉ thai sản trước khi nghỉ Nhân viên phải làm đơn xin nghỉ trước ít nhất 30 ngày kể từ ngày bắt đầu xin nghỉ và phải bàn giao công việc và các phương tiện cho người được chỉ định thay thế</p>
                            <p>Tất cả trường hợp nghỉ phép mà không có đơn xin nghỉ phép chuyển đến phòng Hành chánh nhân sự (trừ trường hợp bất khả kháng) coi như nghỉ không lý do; khi đó nhân viên sẽ phải chịu trách nhiệm nếu việc nghỉ không lý do gây hậu quả xấu tới công việc liên quan, đồng thời phải chịu hình thức kỷ luật theo quy định hiện hành của Công ty và Luật Lao động Việt Nam</p>
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100%',
    },
});
NoiQuyCty.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NoiQuyCty);
