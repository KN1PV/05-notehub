import { useState } from 'react';
import NoteList from '../NoteList/NoteList';
import css from './App.module.css';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import NoteModal from '../NoteModal/NoteModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['notes', currentPage, searchQuery],
    queryFn: () => fetchNotes(searchQuery || '', currentPage),
    placeholderData: keepPreviousData,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox searchQuery={searchQuery} onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={data.totalPages}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      <NoteList notes={data?.notes || []} />
      {isModalOpen && <NoteModal isOpen={isModalOpen} onClose={closeModal} />}
    </div>
  );
}

export default App;