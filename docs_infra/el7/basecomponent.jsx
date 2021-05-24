import React from 'react';

export const LinkTag = ({children, url}) => (
    <p><i class="fas fa-external-link-alt"><a href={url}> {children}</a></i></p>
);
