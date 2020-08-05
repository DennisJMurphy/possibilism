import React from "react";
export default function ProfilePic(props) {
    //console.log("props in profilepic", props);
    let { first, last, image } = props;
    image = image || "/Riffi_icon.jpg";
    //console.log("imgUrl: ", image);

    return (
        <React.Fragment>
            <img
                onClick={props.toggleModal}
                src={image}
                alt={(first, last)}
                height="70px"
            />
        </React.Fragment>
    );
}
// Pete called this page something else - presentational, but it's called profile pic in the class notes anyway...
// "presentational" components are 'dumb', "container" components are 'smart'
