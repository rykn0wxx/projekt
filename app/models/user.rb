# == Schema Information
#
# Table name: users
#
#  id                 :integer          not null, primary key
#  admin              :boolean          default(FALSE)
#  email              :string           default(""), not null
#  encrypted_password :string           default(""), not null
#  username           :string           default(""), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_users_on_email     (email) UNIQUE
#  index_users_on_username  (username) UNIQUE
#

class User < ApplicationRecord
  attr_accessor :login
  validates :email, :username, presence: true, uniqueness: true
  devise :database_authenticatable, :registerable, :validatable

	def self.find_for_database_authentication warden_conditions
	  conditions = warden_conditions.dup
	  login = conditions.delete(:login)
	  where(conditions).where(['lower(username) = :value OR lower(email) = :value', {value: login.strip.downcase}]).first
	end
end
