import css from './SearchBox.module.css'
import { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface SearchBoxProps {
    searchQuery: string;
    onChange: (value: string) => void;
    onSearch: (query: string) => void;
}

export default function SearchBox({ searchQuery, onChange, onSearch }: SearchBoxProps) {
    const debouncedSearch = useDebouncedCallback(
        (value: string) => {
            onSearch(value);
        }, 300
    );

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <input
            className={css.input}
            type="text"
            placeholder="Search notes"
            value={searchQuery}
            onChange={handleInputChange}
        />
    );
}