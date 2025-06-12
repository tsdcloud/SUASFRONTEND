import { useState, useEffect } from 'react';
import Preloader from '../Preloader';

export default function UsersTable({ users }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referenceNumber?.toString().includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="w-full overflow-hidden animate-fade-in">
      {/* Barre de recherche */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Recherche par nom ou ref... "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        {/* Scroll horizontal sur mobile/tablette */}
        <div className="overflow-x-auto">
          <table className="max-w-1/2 table-auto border-collapse bg-white divide-y divide-primary">
            <thead className="bg-green-200 text-gray-700 uppercase text-sm tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3 text-left font-semibold">Réf.</th>
                <th scope="col" className="px-6 py-3 text-left font-semibold">Nom</th>
                <th scope="col" className="px-6 py-3 text-left font-semibold">Email</th>
                <th scope="col" className="px-6 py-3 text-left font-semibold">Numéro</th>
                {/* <th scope="col" className="px-6 py-3 text-left font-semibold">Téléphone</th> */}
                {/* <th scope="col" className="px-6 py-3 text-left font-semibold">Sexe</th> */}
                <th scope="col" className="px-6 py-3 text-left font-semibold">Admin</th>
                {/* <th scope="col" className="px-6 py-3 text-left font-semibold">Role</th> */}
                {/* <th scope="col" className="px-6 py-3 text-left font-semibold hidden sm:table-cell">Propriétaire</th> */}
                {/* <th scope="col" className="px-6 py-3 text-left font-semibold hidden sm:table-cell">Staff</th>  */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {paginatedUsers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-green-900">{item.referenceNumber}</td>
                  <td className="px-6 py-4 max-w-xs truncate text-green-900">{item.name}</td>
                  <td className="px-6 py-4 max-w-xs truncate text-green-900 ">{item.email ? item.email : "non défini"}</td>
                  {/* <td className="px-6 py-4 max-w-xs truncate text-green-900 ">{item.surname}</td> */}
                  <td className="px-6 py-4 max-w-xs truncate text-green-900 ">{item.phone}</td>
                  {/* <td className="px-6 py-4 max-w-xs truncate text-green-900">{item.gender}</td> */}
                  <td className="px-6 py-4 max-w-xs truncate text-green-900 ">{item.isAdmin ? "oui" : "non"}</td>
                  {/* <td className="px-6 py-4 max-w-xs truncate text-green-900 ">{item.userRole.name}</td> */}
                  {/* <td className="px-6 py-4 max-w-xs truncate text-green-900 hidden sm:table-cell">{item.isOwner ? "oui" : "non"}</td>
                  <td className="px-6 py-4 max-w-xs truncate text-green-900 hidden sm:table-cell">{item.isStaff ? "oui" : "non"}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex sm:justify-start justify-between items-center mt-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
            >
              Précédent
            </button>
            <span className="text-sm text-gray-600 mx-4">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}