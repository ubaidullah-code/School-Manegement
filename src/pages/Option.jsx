import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap';

const SchoolManagement = () => {
    const studentRef = useRef(null);
    const teacherRef = useRef(null);
    const adminRef = useRef(null);

    const studentCanvasRef = useRef(null);
    const teacherCanvasRef = useRef(null);
    const adminCanvasRef = useRef(null);

    const [studentLoading, setStudentLoading] = useState(true);
    const [teacherLoading, setTeacherLoading] = useState(true);
    const [adminLoading, setAdminLoading] = useState(true);


    useEffect(() => {
        // Initialize Three.js scenes for each section
        const init3DScene = (canvasRef, modelPath, setLoading) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
            camera.position.z = 5;

            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); // Added antialias
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            renderer.setClearColor(0x000000, 0);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.minDistance = 3;
            controls.maxDistance = 7;

            const light = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(light);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(5, 3, 5);
            scene.add(directionalLight);

            const loader = new GLTFLoader();
            loader.load(
                modelPath,
                (gltf) => {
                    const model = gltf.scene;
                    scene.add(model);
                    model.scale.set(1, 1, 1);
                    model.position.set(0, 0, 0);

                    setLoading(false); // Model loaded!

                    const animate = () => {
                        requestAnimationFrame(animate);
                        controls.update();
                        renderer.render(scene, camera);
                    };

                    animate();
                },
                undefined,
                (error) => {
                    console.error("An error happened loading the model.", error);
                    setLoading(false); //Even if the model fails to load, set loading to false to prevent infinite loading state

                    //Fallback to a simple colored cube if model fails to load
                    const geometry = new THREE.BoxGeometry(1, 1, 1);
                    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                    const cube = new THREE.Mesh(geometry, material);
                    scene.add(cube);

                    const animate = () => {
                        requestAnimationFrame(animate);
                        cube.rotation.x += 0.01;
                        cube.rotation.y += 0.01;
                        controls.update();
                        renderer.render(scene, camera);
                    };

                    animate();
                }
            );

            const handleResize = () => {
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvas.clientWidth, canvas.clientHeight);
                renderer.render(scene, camera);
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                controls.dispose();
                renderer.dispose();
                scene.dispose();
            };
        };

        // Initialize scenes for each section
        const cleanupStudent = init3DScene(studentCanvasRef, '/models/student.glb', setStudentLoading);
        const cleanupTeacher = init3DScene(teacherCanvasRef, '/models/teacher.glb', setTeacherLoading);
        const cleanupAdmin = init3DScene(adminCanvasRef, '/models/administrator.glb', setAdminLoading);


        return () => {
            cleanupStudent();
            cleanupTeacher();
            cleanupAdmin();
        };

    }, []);

    useEffect(() => {
        // GSAP animations for section appearance
        gsap.fromTo(studentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
        gsap.fromTo(teacherRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.4 });
        gsap.fromTo(adminRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.6 });
    }, []);


    const handleHover = (ref) => {
        gsap.to(ref.current, { scale: 1.05, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', duration: 0.2 }); // Added shadow
    };

    const handleMouseLeave = (ref) => {
        gsap.to(ref.current, { scale: 1, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', duration: 0.2 }); // Adjusted shadow
    };



    return (
        <div className="min-h-screen py-12" style={{ background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',  }}>
            <div className="container mx-auto px-4 ">
                <h1 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight">School Management Options</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6  ">

                    <div
                        ref={studentRef}
                        className=" rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg transform hover:scale-105 "
                        onMouseEnter={() => handleHover(studentRef)}
                        onMouseLeave={() => handleMouseLeave(studentRef)}
                    >
                        <div className="relative h-48 md:h-64">
                            <canvas ref={studentCanvasRef} className="w-full h-full"></canvas>
                            {studentLoading && (
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-50">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-black mb-3">Student</h2>
                            <p className="text-black leading-relaxed">Manage student records, attendance, and grades with ease.</p>
                            <button className="mt-4 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline w-full transition-colors duration-300">
                                Go to Student Section
                            </button>
                        </div>
                    </div>


                    <div
                        ref={teacherRef}
                        className=" rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg transform hover:scale-105"
                        onMouseEnter={() => handleHover(teacherRef)}
                        onMouseLeave={() => handleMouseLeave(teacherRef)}
                    >
                        <div className="relative h-48 md:h-64">
                            <canvas ref={teacherCanvasRef} className="w-full h-full"></canvas>
                            {teacherLoading && (
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-50">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-black mb-3">Teacher</h2>
                            <p className="text-black leading-relaxed">Manage courses, assignments, and student evaluations efficiently.</p>
                            <button className="mt-4 bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline w-full transition-colors duration-300">
                                Go to Teacher Section
                            </button>
                        </div>
                    </div>


                    <div
                        ref={adminRef}
                        className=" rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg transform hover:scale-105"
                        onMouseEnter={() => handleHover(adminRef)}
                        onMouseLeave={() => handleMouseLeave(adminRef)}
                    >
                        <div className="relative h-48 md:h-64">
                            <canvas ref={adminCanvasRef} className="w-full h-full"></canvas>
                            {adminLoading && (
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-50">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-black mb-3">Administrator</h2>
                            <p className="text-black leading-relaxed">Manage school settings, users, and system configurations effectively.</p>
                            <button className="mt-4 bg-red-600 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline w-full transition-colors duration-300">
                                Go to Admin Section
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SchoolManagement;