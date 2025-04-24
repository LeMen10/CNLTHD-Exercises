import { useState, useEffect } from 'react';
import { TrashIcon, UpdateIcon } from '~/components/Icons';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './Users.module.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as request from '~/utils/request';

const cx = className.bind(styles);

const Users = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

    const [checkedDelete, setCheckedDelete] = useState(false);
    const [productIdDelete, setProductIdDelete] = useState();
    const [pageCount, setPageCount] = useState(0);
    const [currentPageProduct, setCurrentPageProduct] = useState(1);
    const [users, setUsers] = useState([]);
    const [modalType, setModalType] = useState(null); // 'add', 'update', or null
    const [userFormData, setUserFormData] = useState({
        _id: null,
        username: '',
        email: '',
        password: '',
        fullname: '',
        phone_number: '',
        address: '',
        is_active: true,
        is_staff: false,
    });

    const postsPerPage = 8;

    const getUsers = async (page) => {
        try {
            const res = await request.get(`/api/admin/get-users?page=${page}&limit=${postsPerPage}`);
            setUsers(res.users);
            // setPageCount(res.page_count);
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await request.get('/');
                setUsers(res.users);
                console.log(res);
                // setPageCount(res.page_count);
            } catch (error) {
                console.error('Error fetching genres:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        })();
    }, [navigate]);

    const handleSaveUser = async () => {
        if (!userFormData.username.trim() || !userFormData.email.trim() || !userFormData.fullname.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (modalType === 'add' && !userFormData.password.trim()) {
            toast.error('Please enter a password for the new user');
            return;
        }

        try {
            const payload = {
                username: userFormData.username,
                email: userFormData.email,
                full_name: userFormData.fullname,
                phone_number: userFormData.phone_number,
                address: userFormData.address,
                role: userFormData.is_staff ? 'staff' : 'user',
                active: userFormData.is_active,
            };

            if (modalType === 'add') {
                payload.password = userFormData.password;

                const { user } = await request.post('/create', payload);
                setUsers([...users, user]);
                toast.success('User added successfully');
            } else if (modalType === 'update') {
                console.log(userFormData);
                const { user } = await request.put(`/update/${userFormData._id}`, payload);
                setUsers(users.map((u) => (u._id === user._id ? user : u)));
                toast.success('User updated successfully');
            }

            // Reset form
            setModalType(null);
            setUserFormData({
                _id: null,
                username: '',
                email: '',
                password: '',
                fullname: '',
                phone_number: '',
                address: '',
                is_active: true,
                is_staff: false,
            });
        } catch (error) {
            console.error(`Error ${modalType === 'add' ? 'adding' : 'updating'} user:`, error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error(`Failed to ${modalType === 'add' ? 'add' : 'update'} user. Please try again.`);
            }
        }
    };

    const handleDeleteUser = async () => {
        if (!productIdDelete) return;
        try {
            await request.delete_method(`/delete/${productIdDelete}`);
            setUsers(users.filter((user) => user._id !== productIdDelete));
            setCheckedDelete(false);
            setProductIdDelete(null);
            toast.success('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error('Failed to delete user. Please try again.');
            }
        }
    };

    // modal update
    const handleEditUser = (user) => {
        setUserFormData({
            _id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.full_name,
            phone_number: user.phone_number,
            address: user.address,
        });
        setModalType('update');
    };

    // Hàm xử lý checkbox xóa
    const handleCheckDelete = (event) => {
        const targetId = event.currentTarget.dataset.id;
        console.log('targetId', targetId);
        setCheckedDelete(!checkedDelete);
        setProductIdDelete(targetId);
    };

    // Hàm xử lý pagination
    const handlePageClick = (event) => {
        const currentPage = event.selected + 1;
        getUsers(currentPage);
        setCurrentPageProduct(currentPage);
    };

    const handleBasicSearch = async () => {
        try {
            const res = await request.get(`/search?query=${searchQuery}`);
            console.log('res', res);
            setUsers(res.users);
            // setPageCount(0); // Reset pagination for search results
        } catch (error) {
            console.error('Error searching users:', error);
            toast.error('Failed to search users');
        }
    };

    const handleAdvancedSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('query', searchQuery);
            if (sortField) params.append('sortField', sortField);
            if (sortOrder) params.append('sortOrder', sortOrder);

            const res = await request.get(`/advanced-search?${params.toString()}`);
            setUsers(res.users);
            // setPageCount(0); // Reset pagination for search results
        } catch (error) {
            console.error('Error with advanced search:', error);
            toast.error('Failed to perform advanced search');
        }
    };

    const handleResetSearch = async () => {
        setSearchQuery('');
        setSortField('');
        setSortOrder('asc');
        getUsers(1); // Reset to first page of all users
    };

    return (
        <div className={cx('container_m')}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className={cx('mt-4', 'mb-4', 'pd-top-20px')}>
                <div className={cx('action')}>
                    <div className={cx('action-container')}>
                        <div className={cx('actions-wrap')}>
                            <div className={cx('action-list')}>
                                <div className={cx('search-container')}>
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={cx('search-input')}
                                    />
                                    <button className={cx('btn-custom', 'btn--primary', 'mr-10')} onClick={handleBasicSearch}>
                                        Search
                                    </button>
                                    <button
                                        className={cx('btn--secondary', 'btn-custom')}
                                        onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
                                    >
                                        {isAdvancedSearch ? 'Hide Advanced' : 'Advanced Search'}
                                    </button>
                                    <button
                                        className={cx('btn--danger', 'btn-custom')}
                                        onClick={handleResetSearch}
                                        disabled={!searchQuery && !sortField}
                                    >
                                        Reset
                                    </button>
                                </div>

                                <button
                                    className={cx('btn-custom', 'btn--primary', 'mr-10')}
                                    onClick={() => {
                                        setUserFormData({
                                            id: null,
                                            username: '',
                                            email: '',
                                            password: '',
                                            fullname: '',
                                            profile_pic: null,
                                            is_active: true,
                                            is_staff: false,
                                        });
                                        setModalType('add');
                                    }}
                                >
                                    create user
                                </button>
                            </div>
                            {isAdvancedSearch && (
                                <div className={cx('advanced-search')}>
                                    <div className={cx('form-group')}>
                                        <label>Sort Field:</label>
                                        <select
                                            value={sortField}
                                            onChange={(e) => setSortField(e.target.value)}
                                            className={cx('form-control-input')}
                                        >
                                            <option value="">None</option>
                                            <option value="username">Username</option>
                                            <option value="email">Email</option>
                                            <option value="full_name">Full Name</option>
                                            <option value="created_at">Created At</option>
                                        </select>
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label>Sort Order:</label>
                                        <select
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value)}
                                            className={cx('form-control-input')}
                                        >
                                            <option value="asc">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select>
                                    </div>
                                    <button className={cx('btn-custom', 'btn--primary')} onClick={handleAdvancedSearch}>
                                        Apply Advanced Search
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={cx('table-wrap', 'mt-4')}>
                    <div className={cx('table-container')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th scope="col">username</th>
                                    <th scope="col">email</th>
                                    <th scope="col">fullname</th>
                                    <th scope="col">phone number</th>
                                    <th scope="col">address</th>
                                    <th scope="col">active</th>
                                    <th scope="col">staff</th>
                                    <th scope="col" style={{ textAlign: 'center' }} colSpan="2">
                                        action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 &&
                                    users.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.full_name}</td>
                                            <td>{user.phone_number}</td>
                                            <td>{user.address}</td>
                                            <td>{user.is_active ? 'Yes' : 'No'}</td>
                                            <td>{user.is_staff ? 'Yes' : 'No'}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <span
                                                        className={cx('btn-delete')}
                                                        data-id={user._id}
                                                        onClick={(e) => handleCheckDelete(e)}
                                                    >
                                                        <TrashIcon fill={'#eb5959'} />
                                                    </span>
                                                    <div
                                                        className={cx('btn-edit')}
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        <UpdateIcon fill={'#1b8fd7'} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pageCount > 0 && (
                    <div className={styles['pagination-container']}>
                        <ReactPaginate
                            onPageChange={handlePageClick}
                            previousLabel={'<'}
                            breakLabel={'...'}
                            nextLabel={'>'}
                            pageCount={pageCount}
                            marginPagesDisplayed={3}
                            pageRangeDisplayed={3}
                            containerClassName={'pagination_custom'}
                            pageClassName={'page-item_custom'}
                            pageLinkClassName={'page-link_custom'}
                            previousClassName={'page-item_custom'}
                            previousLinkClassName={'page-link_custom'}
                            nextClassName={'page-item_custom'}
                            nextLinkClassName={'page-link_custom'}
                        />
                    </div>
                )}
            </div>

            {/* Modal delete user */}
            {checkedDelete && (
                <div className={cx('modal')}>
                    <div className={cx('modal__overlay')} onClick={() => setCheckedDelete(false)} />
                    <div className={cx('modal__body')}>
                        <div className={cx('auth-form')}>
                            <div className={cx('auth-form__container')}>
                                <div className={cx('auth-form__header')}>
                                    <TrashIcon fill={'#ff5556'} />
                                </div>
                                <div>
                                    <h3>Are you sure?</h3>
                                    <p>
                                        Do you really want to permanently delete this user? This action cannot be
                                        undone!
                                    </p>
                                </div>
                                <div className={cx('auth-form__control')}>
                                    <button
                                        className={cx('btn-custom', 'btn--normal', 'mr-10')}
                                        onClick={() => setCheckedDelete(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button className={cx('btn-custom', 'btn--primary')} onClick={handleDeleteUser}>
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal add/update */}
            {modalType && (
                <div className={cx('modal')}>
                    <div className={cx('modal__overlay')} onClick={() => setModalType(null)} />
                    <div className={cx('modal__body')}>
                        <div className={cx('auth-form')}>
                            <div className={cx('auth-form__container')}>
                                <h3 className={cx('auth-form__header')}>
                                    {modalType === 'add' ? 'Create User' : 'Update User'}
                                </h3>
                                <div className={cx('form-group', 'mt-10')}>
                                    <label htmlFor="username">username</label>
                                    <input
                                        type="text"
                                        className={cx('form-control-input')}
                                        id="username"
                                        value={userFormData.username}
                                        onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                                    />
                                </div>
                                <div className={cx('form-group', 'mt-10')}>
                                    <label htmlFor="email">email</label>
                                    <input
                                        type="email"
                                        className={cx('form-control-input')}
                                        id="email"
                                        value={userFormData.email}
                                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                                    />
                                </div>
                                <div className={cx('form-group', 'mt-10')}>
                                    <label htmlFor="fullname">full name</label>
                                    <input
                                        type="text"
                                        className={cx('form-control-input')}
                                        id="fullname"
                                        value={userFormData.fullname}
                                        onChange={(e) => setUserFormData({ ...userFormData, fullname: e.target.value })}
                                    />
                                </div>
                                {modalType === 'add' && (
                                    <div className={cx('form-group', 'mt-10')}>
                                        <label htmlFor="password">password</label>
                                        <input
                                            type="password"
                                            className={cx('form-control-input')}
                                            id="password"
                                            value={userFormData.password}
                                            onChange={(e) =>
                                                setUserFormData({ ...userFormData, password: e.target.value })
                                            }
                                        />
                                    </div>
                                )}
                                <div className={cx('form-group', 'mt-10')}>
                                    <label htmlFor="phone_number">phone number</label>
                                    <input
                                        type="text"
                                        className={cx('form-control-input')}
                                        id="phone_number"
                                        value={userFormData.phone_number}
                                        onChange={(e) =>
                                            setUserFormData({ ...userFormData, phone_number: e.target.value })
                                        }
                                    />
                                </div>
                                <div className={cx('form-group', 'mt-10')}>
                                    <label htmlFor="address">address</label>
                                    <input
                                        type="text"
                                        className={cx('form-control-input')}
                                        id="address"
                                        value={userFormData.address}
                                        onChange={(e) => setUserFormData({ ...userFormData, address: e.target.value })}
                                    />
                                </div>
                                <div className={cx('auth-form__control')}>
                                    <button
                                        className={cx('btn-custom', 'btn--normal', 'mr-10')}
                                        onClick={() => setModalType(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button className={cx('btn-custom', 'btn--primary')} onClick={handleSaveUser}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
