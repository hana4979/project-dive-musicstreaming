import { Link } from 'react-router-dom';

import membershipStyle from '../../css/membership/membership.module.css';

const MembershipMenu = () => {
    return (
        <div className={membershipStyle.menu}>
            <Link to='/membership/all' className={membershipStyle.link}>전체 멤버십</Link>
            <Link to='/membership/streaming' className={membershipStyle.link}>스트리밍</Link>
            <Link to='/membership/download' className={membershipStyle.link}>개별곡 구매</Link>
            <Link to='/membership/gift' className={membershipStyle.link}>선물 이용권</Link>
        </div>
    )
}

export default MembershipMenu;
