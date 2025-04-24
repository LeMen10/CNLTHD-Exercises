import PropTypes from 'prop-types';
import className from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

const cx = className.bind(styles);

const DefaultLayout = ({ children }) => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div>{children}</div>
            </div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
