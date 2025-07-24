import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { GET_BOM_IMAGES_API, imgUrl } from "../../Api/api.tsx";
import Modal from "react-modal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #fff;
  padding: 20px;
  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  padding: 10px;
  width: 100%;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 200px;
  height: 200px;
  cursor: pointer;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  display: ${(props) => (props.loading ? "none" : "block")};
`;

const Loader = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const ViewImages = () => {
    const location = useLocation();
    const Datas = location.state;
    const [imageloading, setImageloading] = useState(false);
    const [observations, setObservations] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const utoken = localStorage.getItem("workspaceuserToken");

    useEffect(() => {
        listObservations();
    }, []);

    const listObservations = async () => {
        setImageloading(true);
        try {
            const params = new URLSearchParams({
                form_id: Datas?.formId || "3",
                section_id: "50",
                submission_id: Datas?.submissionID || "0",
            });

            const response = await fetch(`${GET_BOM_IMAGES_API}?${params.toString()}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${utoken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            const responseData = await response.json();
            if (responseData.Status === 1) {
                setObservations(responseData.info);
            }
            setImageloading(false);
        } catch (error) {
            console.error("Error fetching images:", error);
            setImageloading(false);
        } finally {
            setImageloading(false);
        }
    };

    return (
        <Container>
            <h2 style={{ fontSize: 18, fontWeight: "bold" }}>BOM Attachment</h2>
            {observations.length === 0 && imageloading == false ? (
                <p>Images Not Uploaded</p>
            ) : imageloading ? <p>Images is Loading...</p> : (
                <GridContainer>
                    {observations.map((observation:any, index:any) =>
                        observation.images.map((image:any, imgIdx:any) => (
                            <ImageItem
                                key={`${index}-${imgIdx}`}
                                image={image}
                                imgUrl={imgUrl}
                                setSelectedImage={setSelectedImage}
                            />
                        ))
                    )}
                </GridContainer>
            )}

            {/* Image Zoom Modal */}
            {selectedImage && (
                <Modal
                    isOpen={!!selectedImage}
                    onRequestClose={() => setSelectedImage(null)}
                    style={modalStyles}
                >
                    <div style={modalContentStyle}>
                        <img
                            src={selectedImage}
                            alt="Zoomed Observation"
                            style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" }}
                        />
                        <button onClick={() => setSelectedImage(null)} style={closeButtonStyle}>✖</button>
                    </div>
                </Modal>
            )}
        </Container>
    );
};

const ImageItem = ({ image, imgUrl, setSelectedImage }:any) => {
    const [loading, setLoading] = useState(true);
    const [cachedSrc, setCachedSrc] = useState(imgUrl + image.image);

    return (
        <ImageWrapper>
            {loading && <Loader>Loading...</Loader>}
            <StyledImage
                loading={loading}
                src={cachedSrc}
                alt="Observation"
                onLoad={() => setLoading(false)}
                onError={() => setCachedSrc("/default-placeholder.jpg")}
                onClick={() => setSelectedImage(cachedSrc)}
            />
        </ImageWrapper>
    );
};

const modalStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: "220px", // Adjust this based on your sidebar width
        width: "calc(100vw - 250px)", // Ensures it only covers the content area
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent overlay
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        position: "relative",
        width: "60vw",
        height: "80vh",
        borderRadius: "10px",
        padding: "0",
        overflow: "hidden",
        background: "white",
        outline: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
};

// Modal Content Wrapper
const modalContentStyle = {
    width: "100%",
    height: "100%",
};

// Close Button Style
const closeButtonStyle = {
    position: "absolute",
    borderRadius: '50%',
    top: "15px",
    right: "15px",
    height: 40, width: 40,
    fontSize: 20,
    cursor: "pointer",
    border: "none",
    background: "rgba(0, 0, 0, 0.7)",
    color: "white",
    fontWeight: "bold",
};

export default ViewImages;
