import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after post creation

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        caseDescription: '',
        discussion: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // We could use this for navigation purposes

    const { title, caseDescription, discussion } = formData;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/community', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPosts(res.data); // Set the community posts after fetching
            } catch (err) {
                setError('Failed to load community posts. Please try again.');
                console.error(err);
            }
        };

        fetchPosts(); // Fetch posts when the component mounts
    }, []);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/community', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Post created successfully!');
            setFormData({ title: '', caseDescription: '', discussion: '' }); // Reset form after successful post
            // Refetch posts after successful creation
            const res = await axios.get('/api/community', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts(res.data); // Update posts list
        } catch (err) {
            setError('Failed to create post. Please check your input and try again.');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Community Posts</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
            <form onSubmit={onSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Case Description:</label>
                    <textarea
                        name="caseDescription"
                        value={caseDescription}
                        onChange={onChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Discussion:</label>
                    <textarea
                        name="discussion"
                        value={discussion}
                        onChange={onChange}
                    ></textarea>
                </div>
                <button type="submit">Create Post</button>
            </form>
            <h3>All Posts:</h3>
            <ul>
                {posts.map((post) => (
                    <li key={post._id}>
                        <strong>{post.title}</strong> by Doctor ID: {post.doctor} <br />
                        Case Description: {post.caseDescription} <br />
                        Discussion: {post.discussion}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Community;
