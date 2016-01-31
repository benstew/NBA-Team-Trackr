--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: beer; Type: TABLE; Schema: public; Tablespace:
--

CREATE TABLE team (
    name text,
    mascot text,
    margin numeric(3,2),
    -- Update this to be (4,2) #Means two digits have to be behind the decimal place
    pace numeric(3,2),
    location text,
    id integer NOT NULL,
    location_id integer,
    image text
);


--
-- Name: beer_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE team_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: beer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner:
--

ALTER SEQUENCE team_id_seq OWNED BY team.id;


--
-- Name: brewery; Type: TABLE; Schema: public; Tablespace:
--

CREATE TABLE location (
    id integer NOT NULL,
    name text
);


--
-- Name: brewery_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: brewery_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE location_id_seq OWNED BY location.id;


--
-- Name: id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY team ALTER COLUMN id SET DEFAULT nextval('team_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY location ALTER COLUMN id SET DEFAULT nextval('location_id_seq'::regclass);


--
-- Data for Name: beer; Type: TABLE DATA; Schema: public;
--

COPY team (name, mascot, margin, pace, location, id, location_id, image) FROM stdin;
Golden State	Warriors	12.7	98.59	California	1	1	chimay_blue.png
San Antonio	Spurs	13.91	93.85	Texas	2	2	generic.png

\.

-- Golden State  Warriors  12.70 98.59 California  1 1 chimay_blue.png
-- San Anonio  Spurs 13.91 93.85 Texas 2 2 generic.png
-- Bons Voeux	lakeshow	9.5	Brasserie Dupont	250	130	chimay_blue.png
-- Boerke Blond	blonde	6.8	Brouwerij Angerik	233	287	generic.png





--
-- Name: beer_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('team_id_seq', 2, true);


--
-- Data for Name: brewery; Type: TABLE DATA; Schema: public;
--

COPY location (id, name) FROM stdin;
-- 1	Brasserie Piedboeuf (AB InBev)
1	California
2	Texas
\.


--
-- Name: brewery_id_seq; Type: SEQUENCE SET; Schema: public;
--

SELECT pg_catalog.setval('location_id_seq', 2, true);


--
-- Name: beer_pkey; Type: CONSTRAINT; Schema: public; Tablespace:
--

ALTER TABLE ONLY team
    ADD CONSTRAINT team_pkey PRIMARY KEY (id);


--
-- Name: brewery_pkey; Type: CONSTRAINT; Schema: public; Tablespace:
--

ALTER TABLE ONLY location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
