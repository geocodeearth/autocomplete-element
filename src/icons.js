import React from 'react'

/**
 * Heroicons v1.0.0 (heroicons.com)
 * Copyright (c) 2020 Refactoring UI Inc.
 *
 * @license MIT
 */

export const LocationMarker = ({className}) =>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>


/**
 * Heroicons v1.0.0 (heroicons.com)
 * Copyright (c) 2020 Refactoring UI Inc.
 *
 * @license MIT
 */
export const SearchIcon = ({className}) =>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>

/**
 * SVG Loaders (github.com/SamHerbert/SVG-Loaders)
 * Copyright (c) 2014 Sam Herbert
 *
 * @license MIT
 */

// this is the `puff` loader
export const Loading = ({ className }) =>
  <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className={className}>
    <g fill="none" fillRule="evenodd" strokeWidth="2">
      <circle cx="22" cy="22" r="1">
        <animate attributeName="r"
          begin="0s" dur="1.4s"
          values="1; 20"
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="0.165, 0.84, 0.44, 1"
          repeatCount="indefinite" />
        <animate attributeName="stroke-opacity"
          begin="0s" dur="1.4s"
          values="1; 0"
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="0.3, 0.61, 0.355, 1"
          repeatCount="indefinite" />
      </circle>
      <circle cx="22" cy="22" r="1">
        <animate attributeName="r"
          begin="-0.7s" dur="1.4s"
          values="1; 20"
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="0.165, 0.84, 0.44, 1"
          repeatCount="indefinite" />
        <animate attributeName="stroke-opacity"
          begin="-0.7s" dur="1.4s"
          values="1; 0"
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="0.3, 0.61, 0.355, 1"
          repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
