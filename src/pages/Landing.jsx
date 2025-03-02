import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { Box, Typography, Container, Button, Grid } from '@mui/material';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useNavigate } from 'react-router';

const Landing = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const navigate = useNavigate()

  useEffect(() => {
    // Create animation timeline
    const tl = gsap.timeline();

    // Animate elements
    tl.from(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
    .from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)"
    })
    .from(subtitleRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5");

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    canvasRef.current.appendChild(renderer.domElement);

    // Create school building model (simplified)
    const geometry = new THREE.BoxGeometry(2, 1.5, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
    const building = new THREE.Mesh(geometry, material);
    scene.add(building);

    // Add roof
    const roofGeometry = new THREE.ConeGeometry(1.5, 1, 4);
    const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.25;
    scene.add(roof);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      building.rotation.y += 0.005;
      roof.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <Container 
      ref={containerRef}
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
        color: 'white'
      }}
    >
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              ref={titleRef}
              variant="h1" 
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 'bold',
                marginBottom: 2
              }}
            >
              Welcome to EduTech Academy
            </Typography>
            <Typography
              ref={subtitleRef}
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.2rem', md: '2rem' },
                opacity: 0.9,
                marginBottom: 4
              }}
            >
              Empowering Education Through Innovation
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button  onClick={()=>{navigate("/option")}} variant="contained" color="primary" size="large">
                Get Started
                
              </Button>
              <Button variant="outlined" color="inherit" size="large">
                Learn More
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box ref={canvasRef} sx={{ 
            width: '100%',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Landing;
