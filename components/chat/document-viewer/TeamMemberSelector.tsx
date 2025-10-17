'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus } from 'lucide-react';
import { TeamMemberSelectorProps, TeamMember } from './types';
import { mockTeamMembers } from './sampleData';

export default function TeamMemberSelector({ onSelect, selectedMembers }: TeamMemberSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>(mockTeamMembers);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter members based on search term
  useEffect(() => {
    const filtered = mockTeamMembers.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (member: TeamMember, role: 'reviewer' | 'approver') => {
    onSelect({ ...member, role }, role);
    setSearchTerm('');
    setIsOpen(false);
  };

  const isAlreadySelected = (memberId: string) => {
    return selectedMembers.some(member => member.id === memberId);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search team members..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {filteredMembers.length > 0 ? (
              <div className="py-2">
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                      ${isAlreadySelected(member.id) ? 'bg-gray-50 opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      {/* Member Info */}
                      <div className="flex items-center space-x-3 flex-1">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                          {member.avatar || getInitials(member.name)}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {member.name}
                            </h4>
                            {isAlreadySelected(member.id) && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Added
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{member.email}</p>
                          <p className="text-xs text-gray-400 truncate">{member.title}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {!isAlreadySelected(member.id) && (
                        <div className="flex flex-col space-y-1 ml-4 flex-shrink-0">
                          <motion.button
                            onClick={() => handleSelect(member, 'reviewer')}
                            className="flex items-center justify-center space-x-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors min-w-[70px]"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <UserPlus size={10} />
                            <span>Reviewer</span>
                          </motion.button>

                          <motion.button
                            onClick={() => handleSelect(member, 'approver')}
                            className="flex items-center justify-center space-x-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors min-w-[70px]"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <UserPlus size={10} />
                            <span>Approver</span>
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                {searchTerm ? `No members found for "${searchTerm}"` : 'No team members available'}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}